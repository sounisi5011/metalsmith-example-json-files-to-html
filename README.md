# JSONファイルからHTMLファイルを生成してみる[Metalsmith]を使ったサンプル

[Metalsmith]: https://metalsmith.io
[Handlebars]: https://handlebarsjs.com
[Node.js]: https://nodejs.org/ja/
[npm]: https://www.npmjs.com
[Netlify]: https://netlify.app

## パソコン内での使い方

1. [Node.js]をインストールする
2. これらのファイルをダウンロードするか、コピペする
3. これらのファイルが入ったディレクトリ（フォルダ）の中で、以下のコマンドを実行し、[npm]から必要な依存関係をダウンロードする。

    ```sh
    npm install
    ```

4. これらのファイルが入ったディレクトリの中で、以下のコマンドを実行し、[Metalsmith]を起動してファイルを生成する。

    ```sh
    node ./index.js
    ```

## [Netlify]での使い方

1. これらのファイルをダウンロードするか、コピペする
2. [Netlify]にアップロードする

## ファイルの説明

* [`README.md`](./README.md)

    この説明用文書のためのファイル。
    GitHubが自動で表示してくれる。
    このサンプル自体に必要ではない。

* [`index.js`](./index.js)

    [Metalsmith]を実行し、JSONファイルを変換するためのスクリプト。
    [Node.js]で実行する。

* [`package.json`](./package.json)

    Node.js用のライブラリを配布している[npm]というパッケージ・マネージャーのためのファイル。
    [Metalsmith]と、Metalsmithのためのプラグインを使うために必要。

    以下のnpmパッケージを使うよう指定している：

    * [`metalsmith`](https://www.npmjs.com/package/metalsmith)

        このサンプルで使用している静的サイトジェネレーター。
        マイナーだが、必要最低限でシンプル。

    * [`metalsmith-json`](https://www.npmjs.com/package/metalsmith-json)

        Metalsmith用プラグインの1つ。JSONファイルを読み取り、Metalsmithで処理可能なデータに変換してくれる。

    * [`metalsmith-layouts`](https://www.npmjs.com/package/metalsmith-layouts)

        Metalsmith用プラグインの1つ。指定されたファイルを、テンプレートファイルを元に変換してくれる。

    * [`jstransformer-handlebars`](https://www.npmjs.com/package/jstransformer-handlebars)

        `metalsmith-layouts`に[Handlebars]テンプレートを処理させるためのもの。

* [`netlify.toml`](./netlify.toml)

    [Netlifyの設定ファイル](https://docs.netlify.com/configure-builds/file-based-configuration/)。
    設定はNetlify上からも可能だが、ファイルにして管理したほうが容易。
    必要ではないが、含めなかった場合は、Netlifyの管理ページから適切な設定を行わなければならない。

* [`.gitignore`](./.gitignore)

    Gitに無視させるファイルやディレクトリを指定するためのファイル。
    このサンプル自体に必要ではない。が、自分のパソコン内でMetalsmithを使うような場合は、Gitにうっかりcommitしてしまわないために必要になる。

    以下のファイル・ディレクトリを無視させている。

    * `package-lock.json`

        [npm]が自動生成するファイル

    * `node_modules/`

        [npm]が自動生成するディレクトリ

* [`templates/character.handlebars`](./templates/character.handlebars)

    各ページのデータを当てはめるテンプレート用ファイル。
    `metalsmith-layouts`が読み取り、各JSONファイルに当てはめてくれる。
    変更する場合は、[`index.js`](./index.js)内の設定を変更する。
    テンプレートの形式は[Handlebars]。

* [`character/data/`](./character/data/)

    各ページのデータを定義するJSONファイルを入れておくディレクトリ。
    [Metalsmith]が自動で読み取り、処理してくれる。
    変更する場合は、[`index.js`](./index.js)内の設定を変更する。

* [`character/intro/`](./character/intro/)

    [Metalsmith]が生成したHTMLファイルが入っているディレクトリ。
    変更する場合は、[`index.js`](./index.js)内の設定を変更する。
