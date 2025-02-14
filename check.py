import io, requests, json

packageNames = json.loads(io.open("input.example.json", "r").read())

not_found = []

def check(packageName):
  try:
    meta_data = requests.get(f"https://f-droid.org/api/v1/packages/{packageName}").json()
    version = meta_data["packages"][0]["versionCode"]
    # response = requests.get(f"https://f-droid.org/repo/{packageName}_{version}.apk")
    # if (response.status_code != 200):
    #   print(f"Error when downloading : {packageName}", response.status_code)
    #   not_found.append(packageName)
    #   io.open("not_found.json", "w").write(json.dumps(not_found))
    # else:
    #   print(f"Downloaded : {packageName}")
  except:
    print(f"Error when fetching : {packageName}")
    not_found.append(packageName)
    io.open("not_found.json", "w").write(json.dumps(not_found))

from joblib import Parallel, delayed

Parallel(n_jobs=12)(delayed(check)(packageName) for packageName in packageNames)

print("Done")