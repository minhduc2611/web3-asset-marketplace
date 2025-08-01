```
sequenceDiagram
  participant User
  participant Frontend
  participant Supabase as AuthService
  participant Backend

  %% Email signup/login flow
  (AuthFlow-email-signup 1) User ->> Frontend: Sign up with email & password
  (AuthFlow-email-signup 2) Frontend ->> Supabase: supabase.auth.signUp(email, password)
  (AuthFlow-email-signup 3) Supabase -->> User: Email confirmation link (optional)
  (AuthFlow-email-signup 4) User ->> Supabase: Confirms email (if enabled)
  (AuthFlow-email-signup 5) Supabase -->> Frontend: JWT tokens (access & refresh)
  (AuthFlow-email-signup 6) Frontend ->> Backend: Bearer access_token in header
  (AuthFlow-email-signup 7) Backend ->> Supabase: auth.getUser(token)
  (AuthFlow-email-signup 8) Supabase -->> Backend: Valid user data
  (AuthFlow-email-signup 9) Backend -->> Frontend: Protected resource

%% Email login (existing)
  (AuthFlow-email-login 1) User ->> Frontend: Log in with email/password
  (AuthFlow-email-login 2) Frontend ->> Supabase: supabase.auth.signIn(email, password)
  (AuthFlow-email-login 3) Supabase -->> Frontend: JWT tokens
  (AuthFlow-email-login 4) Frontend ->> Backend: Bearer token
  (AuthFlow-email-login 5) Backend ->> Supabase: auth.getUser(token)
  (AuthFlow-email-login 6) Supabase -->> Backend: Valid user
  (AuthFlow-email-login 7) Backend -->> Frontend: Protected resource

%% Google OAuth signup/login
  (AuthFlow-google-signup-login 1) User ->> Frontend: Click "Sign in with Google"
  (AuthFlow-google-signup-login 2) Frontend ->> Supabase: supabase.auth.signInWithOAuth(provider: google)
  (AuthFlow-google-signup-login 3) Supabase ->> User: Redirect to Google consent
  (AuthFlow-google-signup-login 4) User ->> Google: Approve consent
  (AuthFlow-google-signup-login 5) Google ->> Supabase: OAuth callback
  (AuthFlow-google-signup-login 6) Supabase -->> Frontend: JWT tokens
  (AuthFlow-google-signup-login 7) note right of Supabase: Automatic identity linking if email exists :contentReference[oaicite:1]{index=1}
  (AuthFlow-google-signup-login 8) Frontend ->> Backend: Sends access_token
%% Backend token validation
  (AuthFlow-google-signup-login 9) Backend ->> Supabase: auth.getUser(token)
  (AuthFlow-google-signup-login 10) Supabase -->> Backend: Valid user (possibly linked)
  (AuthFlow-google-signup-login 11) Backend -->> Frontend: Protected data
```
