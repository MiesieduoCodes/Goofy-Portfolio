#!/bin/bash

echo "🔧 Deploying Firebase Storage rules..."

# Deploy storage rules
firebase deploy --only storage

echo "✅ Storage rules deployed successfully!"
