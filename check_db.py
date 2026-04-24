import os
import json
import urllib.request

env = {}
with open(r'c:\Users\aymen\Desktop\game-tour\.env.local', 'r') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v.strip('"\'')

url = env['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/profiles?select=id,username,balance'
req = urllib.request.Request(url, headers={
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': 'Bearer ' + env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
})

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print('DB PROFILES:')
        for row in data:
            print('User:', row.get('username'), 'Balance:', row.get('balance'))
            if str(row.get('balance')) == '1852' or str(row.get('balance')) == '1852.0':
                print('>>> FOUND 1852 IN DATABASE! <<<')
except Exception as e:
    print('Failed to query DB:', e)
