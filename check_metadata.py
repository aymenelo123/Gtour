import urllib.request
import json
import os

env = {}
with open(r'c:\Users\aymen\Desktop\game-tour\.env.local', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v.strip('"\'')

key = env.get('SUPABASE_SERVICE_ROLE_KEY')
if not key:
    print('No service role key found. Cannot query auth.users directly.')
else:
    url = env['NEXT_PUBLIC_SUPABASE_URL'] + '/auth/v1/users'
    # Supabase uses admin API for listing users, but let's try with service role
    req = urllib.request.Request(url, headers={'apikey': key, 'Authorization': 'Bearer ' + key})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print('AUTH USERS METADATA:')
            users = data.get('users', []) if isinstance(data, dict) else data
            for u in users:
                meta = u.get('user_metadata', {})
                print(f"User {u.get('email')}: metadata={meta}")
                if '1852' in str(meta):
                    print('>>> FOUND 1852 IN METADATA! <<<')
    except Exception as e:
        print('Error fetching auth users:', e)
