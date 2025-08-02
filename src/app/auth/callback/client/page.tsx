"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import authService from '@/lib/auth-service';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function OAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the full URL including fragment
        const fullUrl = window.location.href;
        console.log("🎯 >>>>>>>>> Full OAuth callback URL:", fullUrl);

        // Extract parameters from URL fragment
        const fragment = window.location.hash.substring(1); // Remove the #
        const params = new URLSearchParams(fragment);
        
        // Check for error first
        const error = params.get('error');
        const errorCode = params.get('error_code');
        const errorDescription = params.get('error_description');

        if (error) {
          console.error("OAuth error:", { error, errorCode, errorDescription });
          setStatus('error');
          setMessage(errorDescription || 'An error occurred during authentication');
          
          toast.error("Authentication failed", {
            description: errorDescription || "An error occurred during authentication",
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Extract tokens
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresAt = params.get('expires_at');
        const expiresIn = params.get('expires_in');
        const tokenType = params.get('token_type');
        const type = params.get('type');

        console.log("🎯 >>>>>>>>> OAuth tokens:", { 
          accessToken, 
          refreshToken, 
          expiresAt, 
          expiresIn, 
          tokenType, 
          type 
        });

        if (!accessToken) {
          setStatus('error');
          setMessage('No access token received from authentication provider');
          
          toast.error("Authentication failed", {
            description: "No access token received from authentication provider",
          });
          
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Handle different authentication types
        if (type === 'recovery') {
          // This is a password reset flow
          setStatus('success');
          setMessage('Password reset successful! You are now logged in.');
          
                     // Store tokens and redirect
           if (accessToken && refreshToken && expiresAt) {
             authService.setTokensFromExternal({
               access_token: accessToken,
               refresh_token: refreshToken,
               expires_at: parseInt(expiresAt) * 1000, // Convert to milliseconds
             });
            
            toast.success("Password reset successful!", {
              description: "You are now logged in.",
            });
          }
          
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        // Handle regular OAuth authentication
        try {
          const result = await authService.verifyOAuthToken({
            access_token: accessToken,
            provider: 'oauth', // You can extract this from the URL if needed
            refresh_token: refreshToken || '',
            expires_at: expiresAt ? parseInt(expiresAt) * 1000 : Date.now() + (parseInt(expiresIn || '3600') * 1000),
          });

          if (result.success && result.data) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            
            toast.success("Authentication successful!", {
              description: "You have been logged in successfully.",
            });
            
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } else {
            setStatus('error');
            setMessage(authService.handleAuthError(result));
            
            toast.error("Authentication verification failed", {
              description: authService.handleAuthError(result),
            });
            
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          }
        } catch (error) {
          console.error("OAuth verification error:", error);
          setStatus('error');
          setMessage('Failed to verify authentication with backend');
          
          toast.error("Authentication verification failed", {
            description: "Failed to verify authentication with backend",
          });
          
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }

      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        
        toast.error("Authentication failed", {
          description: "An unexpected error occurred during authentication",
        });
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo size="lg" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                status === 'loading' ? 'bg-blue-600' :
                status === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {status === 'loading' && (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                )}
                {status === 'success' && (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
                {status === 'error' && (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
            </motion.div>
            <CardTitle className={`text-2xl font-bold bg-clip-text text-transparent ${
              status === 'loading' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
              status === 'success' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-pink-600'
            }`}>
              {status === 'loading' && 'Processing Authentication...'}
              {status === 'success' && 'Authentication Successful!'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Please wait while we verify your authentication...'}
              {status === 'success' && message}
              {status === 'error' && message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              {status === 'loading' && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Verifying your authentication...
                </p>
              )}
              {status === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Redirecting to dashboard...
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Redirecting to login...
                </p>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 