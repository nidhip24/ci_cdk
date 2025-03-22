import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Create S3 bucket
    const myBucket = new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: 'cdk-s3-bucket-nk',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const myLambda = new lambda.Function(this, 'MyLambda', {
      functionName: 'cdk-lambda-nk',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
      exports.handler = async function(event) {
        console.log('Lambda invoked!');
        return { statusCode: 200, body: 'Hello, Lamda Fn!' };
      }
      `),
      environment: {
      BUCKET_NAME: myBucket.bucketName,
      },
    });

    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'NKUserTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
