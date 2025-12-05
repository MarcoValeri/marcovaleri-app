'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

// This connects the frontend to the backend
Amplify.configure(outputs);

export default function ConfigureAmplify() {
  return null;
}