// Metalsmithを読み込む
const Metalsmith  = require('metalsmith');
// Metalsmithに必要なプラグインを読み込む
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
