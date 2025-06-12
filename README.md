# Unity Helper

A Visual Studio Code extension to help Unity developers write cleaner code faster.

## Features

- Add Unity `Debug.Log` statements easily:
  - Select a variable
  - Press `Ctrl + Alt + A` (or run "Add Unity Debug Log" from Command Palette)
  - Auto-generates `Debug.Log($"<color=...>{variable}: {value}</color>");` with random colors.

- Inline color picker for `<color=...>` tags inside your Unity C# scripts.
  - Hover over color hex values to select a new color directly.
  - Fully compatible with Unity color tags.

## Commands

| Command | Description |
| --- | --- |
| `UnityHelper.addDebugLog` | Inserts `Debug.Log` for selected variable |

## Requirements

- VSCode 1.100.0 or later
- Unity C# project

## Extension Settings

No settings required.

## Known Issues

- Currently only supports Unity `<color=...>` syntax.

## Release Notes

### 0.0.1

- Initial release with Debug.Log generator and inline color picker.

---

### Author

Published by [dungs72](https://github.com/dungs072)
