// Metalsmithを読み込む
const Metalsmith  = require('metalsmith');
// Metalsmithに必要なプラグインを読み込む
const metalsmithCollections = require('metalsmith-collections');
const metalsmithInPlace     = require('metalsmith-in-place');
const metalsmithJson    = require('metalsmith-json');
const metalsmithLayouts = require('metalsmith-layouts');

// Metalsmithを開始する
Metalsmith(__dirname)
  // 元になるファイルを読み取るディレクトリ（フォルダ）のパスを設定する
  .source('src')

  // 生成したファイルを出力するディレクトリのパスを設定する
  .destination('build')

  // 処理前に、出力先のディレクトリを空にする
  .clean(true)

  // JSONファイルを読み取り、`data`キー内にJSONのデータを格納する
  // テンプレートで使う場合は、`data.データ名`の形式で使う
  .use(metalsmithJson({
    key: 'data',
  }))

  // 各JSONファイルを、テンプレートを元にHTMLデータへ変換する
  .use(metalsmithLayouts({
    // テンプレートのファイル名
    default: 'character.handlebars',

    // テンプレートを入れておくディレクトリの名前
    directory: 'templates',

    // 処理するファイルを指定するGlobパターン
    // 今回は「characterディレクトリの中の.jsonファイル」を対象とする
    // 対象外のファイルは変換されずそのままになる
    pattern: 'character/**/*.json'
  }))

  // 変換したJSONファイルのファイル名を`.html`に変更する
  // これに適するプラグインが無かったため、即興で書いたプラグインを使う
  // 参考：https://metalsmith.io/#how-does-it-work-in-more-detail-
  .use((files, metalsmith, done) => {
    // ファイル一覧がfiles変数に格納されるので、それをループ処理する
    for (const [filename, filedata] of Object.entries(files)) {
      // ファイル名の拡張子「.json」を「.html」に置換する
      const newFilename = filename.replace(/\.json$/, '.html');

      // ファイル名の置換が成功していた場合は、コピー処理を行う
      // 失敗していた場合は、JSONではないファイルなので何もしない
      if (filename !== newFilename) {
        // 古いファイルを消す
        delete files[filename];

        // ファイルのデータを新しいファイルへコピーする
        files[newFilename] = filedata;
      }
    }

    // Metalsmithの都合により、全ての処理が完了した後にこれを実行する必要がある
    done();
  })

  // キャラクター一覧のデータを取得する。
  // 合致する各ファイルの情報が、`collections.キー名`に配列として格納される。
  // 取得したデータは、後続のテンプレート変換処理で使用可能になる。
  .use(metalsmithCollections({
    // 「character/intro」ディレクトリ内の全てのHTMLに対応するデータを取得し、
    // `collections.characters`に格納する。
    // これらのファイルはもともとJSONだが、この時点ではすでに変換済みのため取得できる。
    characters: {
      pattern: 'character/intro/**/*.html',
      // JSONに定義された`sortOrder`の数値を元に、キャラ名を並べ替える
      // 数値が小さいほど前になる
      sortBy: (a, b) => a.data.sortOrder - b.data.sortOrder,
    },
  }))

  // metalsmith-in-placeを使用して、srcディレクトリ内のhandlebarsファイルをHTMLに変換する。
  // 「キャラクターへのリンク集」などを自動生成する場合は、テンプレートに直接データを渡して1つのHTMLに変換する機能が別で必要になるため。
  .use(metalsmithInPlace({
    pattern: '**/*.handlebars',
    engineOptions: {
      // Handlebarsのためのhelperを登録する
      // helperの詳細については以下のドキュメントを参照：
      //   https://handlebarsjs.com/guide/expressions.html#helpers
      helpers: {
        // ファイルパスをNetlify用のURLに変更するもの
        // 使い方：
        //    {{ toNetlifyURL path }}
        //    {{ toNetlifyURL 'path/to/filename.html' }}
        toNetlifyURL: path => (
          path
            // Windowsのパスはバックスラッシュ区切りなので、URLに合わせてスラッシュに置換する
            .replace(/\\/g, '/')
            // 後ろの「.html」および「index.html」を消し、スラッシュに置換する
            .replace(/(?:\/?index\.html)?\.html$/, '/')
        ),
      },
    },
  }))

  // 変換を開始する
  .build(error => {
    if (error) {
      // 変換が失敗した場合は、エラーを出力する
      throw error;
    } else {
      // 変換が成功した場合は、「Success!」と表示する
      console.log('Success!');
    }
  });
