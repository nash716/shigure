# shigure

**WIP** :bow:

Chinachu 向けエンコードマネージャ

## 注意

すべて自己責任でご利用ください。

## 機能

- [x] Chinachu のデータファイルを監視し、録画終了時にエンコード
- [ ] Chinachu が番組を録画している際、ffmpeg の優先度を調整
- [x] エンコードする番組・しない番組の指定が可能

## インストール

Chinachu を動作させているユーザで作業を行うことを推奨します。

```
$ git clone git@github.com:nash716/shigure.git
$ cd shigure
$ npm install
$ npm run easy-install
```

### 設定ファイルの編集

`data/config.json`

```
{
	"chinachu": "/home/chinachu/Chinachu/data",
	"target": [ ".*" ],
	"script": "./encode.sh",
	"output": "{basedir}/{basename}.mp4"
}
```

- `chinachu`
	- Chinachu の data ディレクトリを指定してください。
- `target`
	- エンコード対象の番組名を指定してください。正規表現が利用可能です。  
	FYI: パターンは `new RegExp(target, 'i')` として処理されます。
- `script`
	- エンコードスクリプトを指定してください。スクリプトの `argv[1]` には入力ファイル名、`argv[2]` には出力ファイル名を渡します。フルパスでの指定を推奨します。変更しなければデフォルトのエンコードスクリプトが動作します。
- `output`
	- エンコードスクリプトに渡す出力ファイル名です。`{basedir}` が元ファイルのあるディレクトリ、`{basename}` が元ファイルの名前から `.m2ts` を省いたものです。

### 動作確認

TODO

## 動かす

```
$ node lib/shigure &
```

なお、ログファイルが `shigure/shigure.log` に出力されます。

## 技術的な仕様

- Chinachu の `data/` 以下の JSON ファイルの更新をトリガとして処理を行います。
	- そのため、`$ touch data/recorded.json` などとすることで、shigure は 新しいエンコード対象のファイルを探しに行きます。
		- これは、shigure 導入前のファイルをエンコードしたいときなどに有効です。
- ろくにデバッグをしていないため、録画ファイルの削除などはきちんと動作の様子をみて行うのが懸命だと思います。
