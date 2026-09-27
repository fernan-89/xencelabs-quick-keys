#!/usr/bin/env python3
"""Checks that every .pcfg profile is well-formed and that README.md documents it exactly.

For each profile it verifies that:
  * the XML parses;
  * every shortcut's recorded Windows virtual-key codes match the shortcut text it displays
    (a key labelled "Ctrl+E" really sends Ctrl and E);
  * every key of every set appears in README.md under that profile and set, with the same label
    and shortcut, and README.md documents no key the profile does not have.

Usage: python3 validate-profiles.py   (exit code 1 on any mismatch)
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Windows virtual-key codes for the key names used in the profiles.
VIRTUAL_KEYS = {
    "Ctrl": 17, "Shift": 16, "Alt": 18, "Win": 91, "Tab": 9, "Enter": 13, "Esc": 27,
    "Space": 32, "Left": 37, "Up": 38, "Right": 39, "Down": 40, "/": 191, "`": 192,
}


def virtual_key(name):
    if name in VIRTUAL_KEYS:
        return VIRTUAL_KEYS[name]
    function_key = re.fullmatch(r"F(\d{1,2})", name)
    if function_key:
        return 111 + int(function_key.group(1))
    if len(name) == 1 and name.isalnum():
        return ord(name.upper())
    return None


def profile_keys(path):
    """{(set number, key number): (label, shortcut)} for the five sets of a profile."""
    remote = ET.parse(path).getroot().find(".//Remote")
    keys, errors = {}, []
    for key_set in remote.find("CommonAPP/K").findall("Set"):
        number = int(key_set.get("id")) + 1
        for key in key_set:
            match = re.fullmatch(r"K(\d+)", key.tag)
            text = (key.text or "").strip()
            if not match or not text:
                continue
            _, label, shortcut, codes = text.split("|")[:4]
            label = label.removeprefix("*#")
            recorded = [int(code.split(":")[0]) for code in codes.split("+")]
            expected = [virtual_key(part) for part in shortcut.split("+")]
            if recorded != expected:
                errors.append(f"{path.name} set {number} {key.tag} '{label}': shows {shortcut} "
                              f"but sends virtual keys {recorded} (expected {expected})")
            keys[(number, int(match.group(1)))] = (label, shortcut)
    return keys, errors


def documented_keys(readme, profile_name):
    """Keys the README tables document for one profile, in the same shape as profile_keys."""
    keys, current_profile, current_set = {}, None, None
    for line in readme.splitlines():
        heading = re.match(r"## .*\(`(Xencelabs-\w+\.pcfg)`\)", line)
        if heading:
            current_profile, current_set = heading.group(1), None
        elif line.startswith("## "):
            current_profile = None
        set_heading = re.match(r"\*\*Set (\d+):", line)
        if set_heading:
            current_set = int(set_heading.group(1))
        row = re.match(r"\| \*\*K(\d+)\*\* \| `([^`]*)` \| ``?\s?(.*?)\s?``? \|", line)
        if row and current_profile == profile_name and current_set:
            keys[(current_set, int(row.group(1)))] = (row.group(2), row.group(3).replace(" ", ""))
    return keys


def main():
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    errors = []
    profiles = sorted(ROOT.glob("*.pcfg"))
    for path in profiles:
        try:
            actual, key_errors = profile_keys(path)
        except ET.ParseError as error:
            errors.append(f"{path.name}: invalid XML: {error}")
            continue
        errors.extend(key_errors)
        documented = documented_keys(readme, path.name)
        for key in sorted(actual.keys() | documented.keys()):
            where = f"{path.name} set {key[0]} K{key[1]}"
            if key not in documented:
                errors.append(f"{where}: {actual[key]} is not documented in README.md")
            elif key not in actual:
                errors.append(f"{where}: README.md documents {documented[key]}, which the profile does not have")
            elif actual[key] != documented[key]:
                errors.append(f"{where}: profile has {actual[key]}, README.md says {documented[key]}")
        print(f"{path.name}: {len(actual)} keys checked")
    for error in errors:
        print(f"ERROR {error}", file=sys.stderr)
    if not profiles:
        print("ERROR no .pcfg profiles found", file=sys.stderr)
        return 1
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
