# Data management scripts

### Useful links

[TypeORM doc](https://typeorm.io/)

### API

[API du Grang Lyon](https://data.grandlyon.com/jeux-de-donnees/equipements-sportifs-metropole-lyon-point-interet/api)

## Install

`npm i yarn -g`: install `yarn` (package manager similar to `npm` but more recent).

`nvm install --lts`: install and use latest LTS version of `node`

Install `ts-node-script` command for simple TypeScript script execution:

```
npm install -g typescript
npm install -g ts-node
```

### node script

`ts-script has been deprecated and will be removed in the next major release. Please use ts-node-script instead`

### csv

`ActLib`: the sports

`InsNumeroInstall`: identifier of the infrastructure, to be matched with `idexterne` of the API. WARN: The `idexterne` is sometimes available in 2 parts

## Character encoding

> All info [here](https://www.tecmint.com/convert-files-to-utf-8-encoding-in-linux/).

`file -i input.file`: show character encoding of a file.

`iconv -f ISO-8859-1 -t UTF-8//TRANSLIT input.file -o out.file`: Change encoding from one format to another.
