import os
import json


def rec(path):
    name = os.path.basename(path)
    data = {}
    if os.path.isdir(path):
        data['_t'] = "d"
        data["_p"] = name
        data['c'] = [rec(os.path.join(path, x)) for x in os.listdir(path)]
    else:
        data["_t"] = "f"
        data["_p"] = name.replace(".png", "")
    return data


if __name__ == '__main__':
    os.chdir("src")
    root = os.getcwd()
    data = rec(root)
    os.chdir("../")
    dataStr = json.dumps(data, sort_keys=True)
    with open('imgDirStructure.json', 'w') as json_file:
        json.dump(dataStr, json_file)
