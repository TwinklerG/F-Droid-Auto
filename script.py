# Usage: python script.py
# Description: This script will read the raw file and extract the available package-names and write it to input.json file

import io, json

res = io.open("raw", "r").read()

output = []

for line in res.split("\n"):
  if line.startswith("// "):
    output.append(line[3:])

io.open("input.json", "w").write(json.dumps(output))