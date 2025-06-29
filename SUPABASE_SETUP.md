# Supabase Storage Setup Guide

This guide will help you set up Supabase storage for your application form file uploads.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `fk-crm` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name**: `applications`
   - **Public bucket**: ✅ Check this (or configure RLS policies)
   - **File size limit**: 10MB (or your preferred limit)
4. Click **Create bucket**

## Step 4: Configure Bucket Policies (Optional)

If you want more security, you can configure Row Level Security (RLS) policies:

### Option A: Public Bucket (Simplest)
- Keep the bucket public as created above
- Files will be accessible via public URLs

### Option B: Private Bucket with RLS
1. Uncheck "Public bucket" when creating
2. Go to **Storage** → **Policies**
3. Add policies for your bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read access to uploaded files
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (true);

-- Allow users to delete their own files
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

## Step 5: Configure CORS (If Needed)

If you encounter CORS issues, configure CORS for your bucket:

1. Go to **Storage** → **Settings**
2. Add CORS configuration:

```json
[
  {
    "origin": "*",
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["*"],
    "exposedHeaders": ["*"]
  }
]
```

## Step 6: Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET=applications
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/apply` in your browser
3. Try uploading a test file
4. Check your Supabase dashboard → Storage → applications bucket
5. You should see the uploaded file there

## File Structure in Bucket

Files will be organized by type:
```
applications/
├── passport/
│   ├── uuid1.pdf
│   └── uuid2.jpg
├── transcripts/
│   ├── uuid3.pdf
│   └── uuid4.docx
├── englishTest/
│   └── uuid5.pdf
├── personalStatement/
│   └── uuid6.pdf
└── references/
    └── uuid7.pdf
```

## Troubleshooting

### Common Issues:

1. **"Failed to upload file to storage"**
   - Check your Supabase API keys
   - Verify the bucket name matches `SUPABASE_STORAGE_BUCKET`
   - Check bucket permissions

2. **CORS errors**
   - Configure CORS in Supabase Storage settings
   - Check your domain is allowed

3. **File size too large**
   - Check bucket file size limit
   - Verify your file is under 10MB

4. **Permission denied**
   - Check bucket is public or RLS policies are configured
   - Verify service role key is correct

### Testing Commands:

You can test your Supabase connection with this simple script:

```javascript
// test-supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-project-url'
const supabaseKey = 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test bucket access
async function testBucket() {
  const { data, error } = await supabase.storage
    .from('applications')
    .list()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Bucket contents:', data)
  }
}

testBucket()
```

## Security Best Practices

1. **Keep service role key secret** - Never expose it in client-side code
2. **Use environment variables** - Don't hardcode API keys
3. **Configure RLS policies** - For production, use proper access controls
4. **Validate file types** - The API already validates file types and sizes
5. **Monitor usage** - Check Supabase dashboard for storage usage

## Cost Considerations

Supabase Storage pricing:
- **Free tier**: 1GB storage, 2GB bandwidth
- **Pro tier**: $25/month for 100GB storage, 250GB bandwidth
- **Pay as you go**: $0.021/GB for storage, $0.09/GB for bandwidth

For most applications, the free tier should be sufficient.

## Next Steps

Once your Supabase storage is set up:

1. Test file uploads work correctly
2. Configure email notifications
3. Set up your database (you can use Supabase PostgreSQL too!)
4. Deploy your application

Your application form system is now ready to use with Supabase storage! 🎉 