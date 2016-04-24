# shigure

Chinachu 向けエンコードマネージャ

## 注意

すべて自己責任でご利用ください。

## 機能

- [x] Chinachu のデータファイルを監視し、録画終了時にエンコード
- [x] Chinachu が番組を録画している際、ffmpeg の優先度を調整
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
	- エンコードスクリプトを指定してください。フルパスでの指定を推奨します。スクリプトの `argv[1]` には入力ファイル名、`argv[2]` には出力ファイル名を渡します。変更しなければデフォルトのエンコードスクリプトが動作します。
- `output`
	- エンコードスクリプトに渡す出力ファイル名です。`{basedir}` が元ファイルのあるディレクトリ、`{basename}` が元ファイルの名前から `.m2ts` を省いたものです。

FYI: 設定ファイル変更時には自動で設定が再読込されます。

### 動作確認

TODO

## 動かす

```
$ node lib/shigure &
```

なお、ログファイルが `shigure/shigure.log` に出力されます。

## 止める

```
touch shigure.control
```

このコマンドを実行することで、現在のエンコードタスク終了時に、次のエンコードを行わず、shigure を終了します。

## アップデート

shigure をアップデートするには、まず

```
$ touch shigure.control
```

を実行し、shigure が終了するのを待ちます。その後、

```
$ git pull
$ npm run build
```

を実行することで、shigure がアップデートされます。あとは通常通り起動してください。

## 技術的な仕様

- Chinachu の `data/` 以下の JSON ファイルの更新をトリガとして処理を行います。
	- そのため、`$ touch data/recorded.json` などとすることで、shigure は 新しいエンコード対象のファイルを探しに行きます。
		- これは、shigure 導入前のファイルをエンコードしたいときなどに有効です。
- Chinachu が録画を開始した際には、ffmpeg のプロセスの優先度を `renice` で下げます。録画終了時に優先度を上げるためには root 権限が必要なので、現状実装していません。
- 付属の `libx264-hq-ts.sample.ffpreset` は[こちらのブログ](http://munepi.hatenablog.jp/entry/20091227/1261941397)を参考にして作成しました。
- ろくにデバッグをしていないため、録画ファイルの削除などはきちんと動作の様子をみて行うのが懸命だと思います。

## やること

- [ ] 動作確認を行えるようにする
- [ ] 異常終了時の後片付け
