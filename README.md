# Activity Tracker

A customizable activity heatmap with GitHub-style and yearly views.

## Features

* GitHub-style heatmap (`ghub`)
* Custom color palettes
* Legends and titles
* Weekday, month, and week number display
* Fully configurable via YAML

## Usage


```activity-tracker
folder: (folder name)
key: (frontmatter property)
heatmapType: ghub

range:
  value: 2
  type: year

separateMonths: true

show:
  border: true
  weekday: true
  months: true
  weeknum: true

title:
  text: Activity Tracker
  alignment: center
  size: 20
  weight: 700

cell:
  size: 12
  borderRadius: 3
  gap: 3

legends:
  size: 8
  alignment: right
  borderRadius: 2
  gap: 2

color:
  palette: lavendar
  default: "#ffffff"

limit: [75, 100, 125, 150, 175, 200, 225, 250]
```

## Options

### `heatmapType`

* `ghub` → GitHub-style grid
* `year` → yearly layout (**Not implemented yet**)

### `range`

```yaml
range:
  value: number
  type: year | month
```

### `show`

```yaml
show:
  border: boolean
  weekday: boolean
  months: boolean
  weeknum: boolean
```

### `title`

```yaml
title:
  text: string
  alignment: left | center | right
  size: number
  weight: number
```

### `cell`

```yaml
cell:
  size: number
  borderRadius: number
  gap: number
```

### `legends`

```yaml
legends:
  size: number
  alignment: left | right
  borderRadius: number
  gap: number
```

### `color`

```yaml
color:
  palette: string
  default: hex
```

### `limit`

```yaml
limit: number[]
```

Defines thresholds for color intensity.

## Notes

* Data is fetched from markdown files inside the specified folder
* Styling can be customized via CSS

## Development

```bash
npm install
npm run build
```

## License

This Plugin is licensed under [AGPL-3.0](LICENSE).
