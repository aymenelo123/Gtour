import urllib.request
import json
import os

env = {}
with open(r'c:\Users\aymen\Desktop\game-tour\.env.local', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v.strip('"\'')

url = env['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'
req = urllib.request.Request(url, method='OPTIONS', headers={'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY']})
try:
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode())
        print("PATHS:")
        for path in data.get('paths', {}).keys():
            if 'admin_deposit' in path or 'approve' in path or 'deposit' in path:
                print(path)
                post_data = data['paths'][path].get('post', {})
                params = post_data.get('parameters', [])
                for p in params:
                    print('  Param:', p.get('name'))
except Exception as e:
    print('Error:', e)
