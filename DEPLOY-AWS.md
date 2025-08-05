# EventHub - Complete AWS Deployment Guide

## 🚀 Overview

This guide covers deploying EventHub (Next.js) to AWS using modern serverless architecture with persistent database storage, including free tier options and pricing details.

## 💰 AWS Pricing & Free Tier

### **AWS Free Tier (12 months)**
- ✅ **EC2**: 750 hours/month (t2.micro instance)
- ✅ **RDS**: 750 hours/month (db.t2.micro, 20GB storage)
- ✅ **S3**: 5GB storage, 20,000 GET requests, 2,000 PUT requests
- ✅ **Lambda**: 1M requests/month, 400,000 GB-seconds compute
- ✅ **API Gateway**: 1M API calls/month
- ✅ **CloudFront**: 50GB data transfer, 2M requests
- ✅ **Route 53**: Hosted zone ($0.50/month after free tier)

### **Always Free Tier**
- ✅ **Lambda**: 1M requests/month, 400,000 GB-seconds
- ✅ **DynamoDB**: 25GB storage, 25 read/write capacity units
- ✅ **S3**: First 5GB storage
- ✅ **CloudWatch**: 10 custom metrics, 5GB log ingestion

### **Estimated Monthly Costs (After Free Tier)**
- **EC2 t3.micro**: ~$8.50/month
- **RDS db.t3.micro**: ~$13/month
- **S3 Standard**: ~$0.023/GB
- **Lambda**: $0.20 per 1M requests
- **API Gateway**: $3.50 per 1M requests
- **CloudFront**: $0.085/GB data transfer

## 📋 Prerequisites

1. **AWS Account** (free signup)
2. **AWS CLI** installed and configured
3. **Node.js 18+** installed locally
4. **Git** installed locally
5. **Domain name** (optional, ~$12/year)

## 🔧 Step 1: AWS Account Setup

### 1.1 Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Enter email, password, account name
4. Provide payment method (required, but free tier available)
5. Verify phone number
6. Choose **"Basic support - Free"**

### 1.2 Install AWS CLI
```bash
# Windows
curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"
msiexec /i AWSCLIV2.msi

# Verify installation
aws --version
```

### 1.3 Configure AWS CLI
```bash
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json
```

To get Access Keys:
1. Go to AWS Console → IAM
2. Users → Create User → Add permissions → AdministratorAccess
3. Security credentials → Create access key

## 🗄️ Step 2: Database Setup (Choose One)

### Option A: Amazon RDS (PostgreSQL) - Recommended

#### 2A.1 Create RDS Instance
```bash
# Create DB subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name eventhub-subnet-group \
    --db-subnet-group-description "EventHub DB Subnet Group" \
    --subnet-ids subnet-12345678 subnet-87654321

# Create RDS PostgreSQL instance
aws rds create-db-instance \
    --db-instance-identifier eventhub-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username eventhub_admin \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-12345678 \
    --db-subnet-group-name eventhub-subnet-group \
    --backup-retention-period 7 \
    --storage-encrypted
```

#### 2A.2 Create Database Schema
Create `lib/db-aws-rds.js`:
```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(200) NOT NULL,
        department VARCHAR(100) NOT NULL,
        registration_deadline TIMESTAMP NOT NULL,
        award VARCHAR(500),
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id INTEGER REFERENCES admins(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS event_participations (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        event_id INTEGER REFERENCES events(id),
        status VARCHAR(20) NOT NULL,
        participation_type VARCHAR(20),
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, event_id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    client.release();
  }
}

export const db = {
  // Admin operations
  createAdmin: async (admin) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO admins (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [admin.username, admin.email, admin.password]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findAdminByEmail: async (email) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM admins WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findAdminByUsername: async (username) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM admins WHERE username = $1', [username]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // Student operations
  createStudent: async (student) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO students (name, email, password, department, year) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [student.name, student.email, student.password, student.department, student.year]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findStudentByEmail: async (email) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM students WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // Event operations
  createEvent: async (event) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO events (name, date, time, location, department, registration_deadline, award, description, admin_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [event.name, event.date, event.time, event.location, event.department, event.registration_deadline, event.award, event.description, event.admin_id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  getAllEvents: async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT e.*, 
               (SELECT COUNT(*) FROM event_participations ep WHERE ep.event_id = e.id AND ep.status = 'interested') as interested_count,
               (SELECT COUNT(*) FROM event_participations ep WHERE ep.event_id = e.id AND ep.status = 'joined') as participants_count
        FROM events e 
        WHERE e.is_active = true 
        ORDER BY e.created_at DESC
      `);
      return result.rows;
    } finally {
      client.release();
    }
  },

  getEventsByAdmin: async (adminId) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM events WHERE admin_id = $1 ORDER BY created_at DESC', [adminId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  // Participation operations
  createParticipation: async (participation) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO event_participations (student_id, event_id, status, participation_type) VALUES ($1, $2, $3, $4) RETURNING *',
        [participation.student_id, participation.event_id, participation.status, participation.participation_type]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  findParticipation: async (studentId, eventId) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM event_participations WHERE student_id = $1 AND event_id = $2',
        [studentId, eventId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  updateParticipation: async (studentId, eventId, updates) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE event_participations SET status = $3, participation_type = $4, feedback = $5 WHERE student_id = $1 AND event_id = $2 RETURNING *',
        [studentId, eventId, updates.status, updates.participation_type, updates.feedback]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  deleteParticipation: async (studentId, eventId) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM event_participations WHERE student_id = $1 AND event_id = $2',
        [studentId, eventId]
      );
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  },

  getEventParticipations: async (eventId) => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT ep.*, s.name, s.email, s.department, s.year
        FROM event_participations ep
        JOIN students s ON ep.student_id = s.id
        WHERE ep.event_id = $1
      `, [eventId]);
      
      return result.rows.map(row => ({
        ...row,
        student: {
          id: row.student_id,
          name: row.name,
          email: row.email,
          department: row.department,
          year: row.year
        }
      }));
    } finally {
      client.release();
    }
  },

  getStudentParticipations: async (studentId) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM event_participations WHERE student_id = $1', [studentId]);
      return result.rows;
    } finally {
      client.release();
    }
  }
};
```

### Option B: Amazon DynamoDB (NoSQL) - Serverless

#### 2B.1 Create DynamoDB Tables
```bash
# Create Users table (for both admins and students)
aws dynamodb create-table \
    --table-name EventHub-Users \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=EmailIndex,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Create Events table
aws dynamodb create-table \
    --table-name EventHub-Events \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=admin_id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=AdminIndex,KeySchema=[{AttributeName=admin_id,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Create Participations table
aws dynamodb create-table \
    --table-name EventHub-Participations \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=student_id,AttributeType=S \
        AttributeName=event_id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=StudentIndex,KeySchema=[{AttributeName=student_id,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
        IndexName=EventIndex,KeySchema=[{AttributeName=event_id,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

## 🏗️ Step 3: Choose Deployment Architecture

### Option A: AWS Amplify (Recommended for Next.js)

#### 3A.1 Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### 3A.2 Initialize Amplify Project
```bash
cd C:\Users\shrik\AI_Project\eventhub-nextjs
amplify init

# Choose the following:
# Project name: eventhub
# Environment: prod
# Default editor: Visual Studio Code
# App type: javascript
# Framework: react
# Source directory: src
# Distribution directory: .next
# Build command: npm run build
# Start command: npm run start
```

#### 3A.3 Add Hosting
```bash
amplify add hosting

# Choose:
# Amazon CloudFront and S3
# DEV (S3 only with HTTP)
```

#### 3A.4 Deploy
```bash
amplify publish
```

### Option B: AWS Lambda + API Gateway (Serverless)

#### 3B.1 Install Serverless Framework
```bash
npm install -g serverless
npm install serverless-nextjs-plugin
```

#### 3B.2 Create serverless.yml
```yaml
service: eventhub-nextjs

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    DATABASE_URL: ${env:DATABASE_URL}
    JWT_SECRET: ${env:JWT_SECRET}

plugins:
  - serverless-nextjs-plugin

custom:
  serverless-nextjs:
    nextConfigDir: ./

functions:
  nextjs:
    handler: pages/api
    events:
      - http:
          path: /{proxy+}
          method: ANY
      - http:
          path: /
          method: ANY

resources:
  Resources:
    # CloudFront Distribution
    CloudFrontDistribution:
      Type: AWS::CloudFront::Distribution
      Properties:
        DistributionConfig:
          Origins:
            - DomainName: !GetAtt ApiGatewayRestApi.DomainName
              Id: ApiGateway
              CustomOriginConfig:
                HTTPPort: 443
                OriginProtocolPolicy: https-only
          Enabled: true
          DefaultCacheBehavior:
            TargetOriginId: ApiGateway
            ViewerProtocolPolicy: redirect-to-https
            AllowedMethods: [GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE]
            CachedMethods: [GET, HEAD, OPTIONS]
            ForwardedValues:
              QueryString: true
              Headers: ["*"]
```

#### 3B.3 Deploy Serverless
```bash
serverless deploy
```

### Option C: EC2 + Load Balancer (Traditional)

#### 3C.1 Create EC2 Instance
```bash
# Create key pair
aws ec2 create-key-pair --key-name eventhub-key --query 'KeyMaterial' --output text > eventhub-key.pem
chmod 400 eventhub-key.pem

# Launch EC2 instance
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type t3.micro \
    --key-name eventhub-key \
    --security-group-ids sg-12345678 \
    --subnet-id subnet-12345678 \
    --user-data file://user-data.sh
```

#### 3C.2 Create user-data.sh
```bash
#!/bin/bash
yum update -y
yum install -y nodejs npm git

# Install PM2 for process management
npm install -g pm2

# Clone and setup application
cd /home/ec2-user
git clone https://github.com/YOUR_USERNAME/eventhub-nextjs.git
cd eventhub-nextjs
npm install
npm run build

# Create environment file
cat > .env.local << EOF
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/eventhub
JWT_SECRET=your-jwt-secret
EOF

# Start application with PM2
pm2 start npm --name "eventhub" -- start
pm2 startup
pm2 save

# Install and configure Nginx
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# Configure Nginx reverse proxy
cat > /etc/nginx/conf.d/eventhub.conf << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

systemctl restart nginx
```

## 🔐 Step 4: Security & Environment Setup

### 4.1 Create IAM Roles
```bash
# Create execution role for Lambda
aws iam create-role \
    --role-name EventHubLambdaRole \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }'

# Attach policies
aws iam attach-role-policy \
    --role-name EventHubLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
    --role-name EventHubLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonRDSDataFullAccess
```

### 4.2 Set Environment Variables
```bash
# For Lambda/Amplify
aws ssm put-parameter \
    --name "/eventhub/DATABASE_URL" \
    --value "postgresql://username:password@your-rds-endpoint:5432/eventhub" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/eventhub/JWT_SECRET" \
    --value "your-super-secret-jwt-key" \
    --type "SecureString"
```

### 4.3 Configure Security Groups
```bash
# Create security group for web servers
aws ec2 create-security-group \
    --group-name eventhub-web \
    --description "EventHub Web Security Group"

# Allow HTTP/HTTPS traffic
aws ec2 authorize-security-group-ingress \
    --group-name eventhub-web \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-name eventhub-web \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Create security group for database
aws ec2 create-security-group \
    --group-name eventhub-db \
    --description "EventHub Database Security Group"

# Allow PostgreSQL traffic from web servers only
aws ec2 authorize-security-group-ingress \
    --group-name eventhub-db \
    --protocol tcp \
    --port 5432 \
    --source-group eventhub-web
```

## 🌐 Step 5: Domain & SSL Setup

### 5.1 Register Domain (Route 53)
```bash
# Check domain availability
aws route53domains check-domain-availability --domain-name eventhub.com

# Register domain (if available)
aws route53domains register-domain \
    --domain-name eventhub.com \
    --duration-in-years 1 \
    --admin-contact file://contact.json \
    --registrant-contact file://contact.json \
    --tech-contact file://contact.json
```

### 5.2 Create SSL Certificate
```bash
# Request SSL certificate
aws acm request-certificate \
    --domain-name eventhub.com \
    --subject-alternative-names www.eventhub.com \
    --validation-method DNS

# Note the CertificateArn from the response
```

### 5.3 Configure CloudFront Distribution
```bash
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

Create `cloudfront-config.json`:
```json
{
    "CallerReference": "eventhub-2024",
    "Aliases": {
        "Quantity": 2,
        "Items": ["eventhub.com", "www.eventhub.com"]
    },
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "eventhub-origin",
                "DomainName": "your-alb-domain.us-east-1.elb.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "https-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "eventhub-origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": true,
            "Cookies": {"Forward": "all"}
        }
    },
    "Comment": "EventHub CloudFront Distribution",
    "Enabled": true,
    "ViewerCertificate": {
        "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id",
        "SSLSupportMethod": "sni-only"
    }
}
```

## 📊 Step 6: Monitoring & Logging

### 6.1 CloudWatch Setup
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/lambda/eventhub

# Create custom metrics
aws cloudwatch put-metric-data \
    --namespace "EventHub" \
    --metric-data MetricName=UserRegistrations,Value=1,Unit=Count
```

### 6.2 Set Up Alarms
```bash
# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
    --alarm-name "EventHub-HighErrorRate" \
    --alarm-description "Alert when error rate is high" \
    --metric-name Errors \
    --namespace AWS/Lambda \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

### 6.3 X-Ray Tracing (Optional)
```bash
# Enable X-Ray tracing for Lambda
aws lambda put-function-configuration \
    --function-name eventhub-api \
    --tracing-config Mode=Active
```

## 🚀 Step 7: CI/CD Pipeline

### 7.1 Create CodePipeline
```bash
# Create S3 bucket for artifacts
aws s3 mb s3://eventhub-pipeline-artifacts

# Create CodePipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

Create `pipeline.json`:
```json
{
    "pipeline": {
        "name": "EventHub-Pipeline",
        "roleArn": "arn:aws:iam::123456789012:role/CodePipelineRole",
        "artifactStore": {
            "type": "S3",
            "location": "eventhub-pipeline-artifacts"
        },
        "stages": [
            {
                "name": "Source",
                "actions": [
                    {
                        "name": "Source",
                        "actionTypeId": {
                            "category": "Source",
                            "owner": "ThirdParty",
                            "provider": "GitHub",
                            "version": "1"
                        },
                        "configuration": {
                            "Owner": "YOUR_GITHUB_USERNAME",
                            "Repo": "eventhub-nextjs",
                            "Branch": "main",
                            "OAuthToken": "your-github-token"
                        },
                        "outputArtifacts": [{"name": "SourceOutput"}]
                    }
                ]
            },
            {
                "name": "Build",
                "actions": [
                    {
                        "name": "Build",
                        "actionTypeId": {
                            "category": "Build",
                            "owner": "AWS",
                            "provider": "CodeBuild",
                            "version": "1"
                        },
                        "configuration": {
                            "ProjectName": "EventHub-Build"
                        },
                        "inputArtifacts": [{"name": "SourceOutput"}],
                        "outputArtifacts": [{"name": "BuildOutput"}]
                    }
                ]
            },
            {
                "name": "Deploy",
                "actions": [
                    {
                        "name": "Deploy",
                        "actionTypeId": {
                            "category": "Deploy",
                            "owner": "AWS",
                            "provider": "CloudFormation",
                            "version": "1"
                        },
                        "configuration": {
                            "ActionMode": "CREATE_UPDATE",
                            "StackName": "EventHub-Stack",
                            "TemplatePath": "BuildOutput::template.yaml",
                            "Capabilities": "CAPABILITY_IAM",
                            "RoleArn": "arn:aws:iam::123456789012:role/CloudFormationRole"
                        },
                        "inputArtifacts": [{"name": "BuildOutput"}]
                    }
                ]
            }
        ]
    }
}
```

### 7.2 Create buildspec.yml
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - npm install -g @aws-amplify/cli
      
  pre_build:
    commands:
      - npm install
      
  build:
    commands:
      - npm run build
      - aws cloudformation package --template-file template.yaml --s3-bucket eventhub-pipeline-artifacts --output-template-file packaged-template.yaml
      
  post_build:
    commands:
      - echo Build completed on `date`
      
artifacts:
  files:
    - packaged-template.yaml
    - .next/**/*
```

## 💾 Step 8: Backup & Disaster Recovery

### 8.1 RDS Automated Backups
```bash
# Enable automated backups (7 days retention)
aws rds modify-db-instance \
    --db-instance-identifier eventhub-db \
    --backup-retention-period 7 \
    --apply-immediately
```

### 8.2 Create Manual Snapshot
```bash
aws rds create-db-snapshot \
    --db-instance-identifier eventhub-db \
    --db-snapshot-identifier eventhub-snapshot-$(date +%Y%m%d)
```

### 8.3 Cross-Region Replication
```bash
# Create read replica in different region
aws rds create-db-instance-read-replica \
    --db-instance-identifier eventhub-db-replica \
    --source-db-instance-identifier eventhub-db \
    --db-instance-class db.t3.micro
```

## 🔍 Step 9: Performance Optimization

### 9.1 Enable CloudFront Caching
```javascript
// Add to next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300'
          }
        ]
      }
    ]
  }
}
```

### 9.2 Database Connection Pooling
```javascript
// Update lib/db-aws-rds.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 9.3 Lambda Cold Start Optimization
```javascript
// Add to API routes
export const config = {
  runtime: 'nodejs18.x',
  maxDuration: 30,
  memory: 512
}
```

## 💰 Step 10: Cost Optimization

### 10.1 Set Up Billing Alerts
```bash
# Create billing alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "EventHub-BillingAlarm" \
    --alarm-description "Alert when monthly bill exceeds $50" \
    --metric-name EstimatedCharges \
    --namespace AWS/Billing \
    --statistic Maximum \
    --period 86400 \
    --threshold 50 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 1 \
    --dimensions Name=Currency,Value=USD
```

### 10.2 Use Reserved Instances (for EC2)
```bash
# Purchase reserved instance (1 year, no upfront)
aws ec2 purchase-reserved-instances-offering \
    --reserved-instances-offering-id your-offering-id \
    --instance-count 1
```

### 10.3 Enable S3 Intelligent Tiering
```bash
aws s3api put-bucket-intelligent-tiering-configuration \
    --bucket eventhub-assets \
    --id EntireBucket \
    --intelligent-tiering-configuration Id=EntireBucket,Status=Enabled,Filter={},Tierings=[{Days=1,AccessTier=ARCHIVE_ACCESS},{Days=90,AccessTier=DEEP_ARCHIVE_ACCESS}]
```

## 🎯 Production Checklist

- [ ] AWS account created and configured
- [ ] Database (RDS/DynamoDB) set up and secured
- [ ] Application deployed (Amplify/Lambda/EC2)
- [ ] Domain registered and SSL configured
- [ ] CloudFront distribution created
- [ ] Security groups and IAM roles configured
- [ ] Monitoring and logging enabled
- [ ] CI/CD pipeline set up
- [ ] Backup strategy implemented
- [ ] Cost monitoring enabled
- [ ] Performance optimization applied

## 📊 Architecture Comparison

| Component | Amplify | Lambda + API Gateway | EC2 + ALB |
|-----------|---------|---------------------|-----------|
| **Cost** | $5-15/month | $10-25/month | $15-40/month |
| **Scalability** | Auto | Auto | Manual |
| **Maintenance** | Low | Low | High |
| **Cold Starts** | No | Yes | No |
| **Customization** | Medium | High | Highest |

## 🚀 Go Live!

Your EventHub application is now live on AWS with:
- ✅ **Global CDN** via CloudFront
- ✅ **Auto-scaling** serverless architecture
- ✅ **Managed database** with automated backups
- ✅ **SSL/TLS encryption** for security
- ✅ **Monitoring & alerting** via CloudWatch
- ✅ **CI/CD pipeline** for automated deployments

**Estimated Monthly Cost**: $15-30 (after free tier)
**Live URL**: `https://eventhub.com` or `https://your-cloudfront-domain.cloudfront.net`

Congratulations! Your EventHub is now deployed on enterprise-grade AWS infrastructure! 🎉

## 🆘 Troubleshooting

### Common Issues

#### Lambda Timeout Errors
```javascript
// Increase timeout in serverless.yml
functions:
  api:
    timeout: 30
```

#### Database Connection Issues
```javascript
// Add connection retry logic
const connectWithRetry = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log('Database connection failed, retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};
```

#### High CloudFront Costs
```bash
# Enable compression
aws cloudfront update-distribution \
    --id YOUR_DISTRIBUTION_ID \
    --distribution-config file://compression-config.json
```

#### RDS Connection Limits
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Increase max_connections (requires reboot)
-- Modify parameter group: max_connections = 200
```

For support, check AWS documentation or contact AWS Support (included with paid plans).