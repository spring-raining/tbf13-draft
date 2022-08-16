# Vivliostyle Pubがフォントを指定するしくみ

小形克宏（一般社団法人ビブリオスタイル理事）

## はじめに

Vivliostyle Pub[^1]は、「誰でもCSS組版を楽しめること」を目指して開発されたWebアプリだ。面倒なインストールやコマンドラインによる操作は不要、ネットに{繫|つな}がったブラウザさえあればCSS組版で本を作ることができる。一昨年から開発が進められてきたが、ようやく今年4月にアルファ版を公開するところまで達した。まだまだ開発途中ではあるが、一人でも多くのユーザーに使っていただき、可能ならフィードバックしてもらえるとありがたい[^2]。

![図1 アルファ版公開がはじまったVivliostyle Pub](content/ogwata/image/fig-1.png)
![図1 アルファ版公開がはじまったVivliostyle Pub](./content/ogwata/image/fig-1.png)
![図1 アルファ版公開がはじまったVivliostyle Pub](/content/ogwata/image/fig-1.png)

さて、そのVivliostyle Pubだが、組版エンジン（Vivliostyle.js[^3]）がプレビュー用はローカル、PDF出力用はクライドという具合いに、別々の場所に実装されている。後で詳しく述べるが、これはユーザの使い心地に直結するプレビュー表示を、少しでも早くするためだ[^4]。

ところが、組版エンジンを分離させた結果、ユーザが意識しないままプレビューとPDF出力とでフォントが食い違うことが起こり得るようになった。もしフォントが違えば、プレビューとPDF出力とで行数やページ数が違ってしまう。

とはいえ、仮に食い違ってもそれはCSSにおける`font-family`の指定に従ってフォールバックした結果であり、その意味ではユーザーが指定した動作にすぎない。それでも、同人誌印刷では1ページ違えば印刷料金が変わることもある。知らないうちにプレビューとPDF出力でページが異なってしまえば、ユーザは不信感を持つだろう。

この問題はいずれ解決するべきとは思うが、アーキテクチャの深い部分に関わるものであり、すぐには無理と思われる。本稿の目的はVivliostyle Pubがどのようにフォントを扱っているのかを詳しく説明することだ。これによりユーザーの混乱を少しでも防ぎ、より多くの人にVivliostyle Pubを使ってもらえればと思う。少しの間、お付き合いいただければ幸いである。

なお、本稿の内容は、筆者が主に担当した「Vivliostyle Pubユーザーガイド」[^5]の一部を、一連の読み物として再構成したものであることをお断りしておく。参考のために、対応するユーザーガイドのセクションを〈　〉で示している。それから、本稿はVivliostyle Pubで執筆した[^6]。

## フォントを指定する方法

Vivliostyle Pubでは、どのようにしてフォントや文字サイズを指定するのだろうか？　残念ながら、既存ワードプロセッサのようにテキストを選択し、その部分のフォントや文字サイズを指定するようなUIはまだなく[^7]、別途スタイルシートの中でそれらを指定するという間接的な方法をとっている。

利用できるスタイルシートは下記の3種類。

1. ブラウザのデフォルトスタイルシートにもとづく必要最低限のもの（Plain theme）
2. Vivliostyle Themes[^8]として公開されているnpmパッケージ（Vivliostyle公式theme）
3. ユーザーが自分で書いたCSSスタイルシート（Custom theme）

いずれもActionメニューと呼ばれるプルダウンメニューの中から選択することができる〈Actionメニューの機能 > Theme（スタイル情報の選択）[^9]〉。

上記1で使用されるフォントは、使っているブラウザのデフォルトフォントだ。もっともPlain themeは手早くプレビューを確認するためのもののであり、出力は想定していない。

上記2のVivliostyle公式themeのそれぞれで指定されている`font-family`は下記の通り。

- Book theme for latin font……`Georgia, serif;`
- 文庫用のテーマ……`"游明朝", "YuMincho", serif`
- Slide theme……`'Noto', 'YuGothic', 'Yu Gothic', 'Meiryo', sans-serif`
- Techbook (技術同人誌) theme……`'Neue Frutiger World', 'Verdana',  'Hiragino Sans', sans-serif`
- Academic theme……`'Hiragino Mincho ProN', serif`


## 扱えるフォントの種類とそれらを指定するしくみ

Vivliostyle Pubが利用できるフォントは、以下のようにフォントがおかれた場所によって3つに分別できる。〈文書の作成と保存 > フォントの指定方法[^10]〉

- ユーザーのPCにあるローカルフォント（**フォント1**）
- クラウドにインストールされたフォント（**フォント2**）
- Webフォントサービスのフォント（**フォント3**）

上記**フォント2**のリストはユーザーガイド〈文書の作成と保存 > フォントに関する補足情報 > クラウドにインストールされているフォント一覧[^11]〉にまとめてあるので参考にしてほしい。

それでは、上記のような3種類のフォントを使って、どのようにしてVivliostyle Pubはプレビューしたり、PDF出力したりしているのだろう？　まずプレビューにおけるフォントを指定するしくみを図示する（図2）

![図2](content/ogwata/image/fig-2.png)

次にPDF出力におけるフォントを指定するしくみを図示する（図3）


![図3](content/ogwata/image/fig-3.png)

この結果、
ユーザーのPCにあるローカルフォント（フォント1）はプレビューだけで使える
クラウドにインストールされたフォント（フォント2）はPDF出力だけで使える
プレビューとPDF出力で共通して指定できるのはWebフォントサービスのフォント（フォント3）だけ
ただし、フォント1とフォント2を一致させれば、プレビューとPDF出力とでページが食い違うことはない


## プレビューとPDF出力でフォントを一致させる方法

要するに、プレビューとPDF出力とでフォントを一致させれば食い違うことはない
その一番簡単な方法はWebフォントサービス（フォント3）を利用することだ
Webサイトの方式には、静的サブセッティングと動的サブセッティングの2つがある
前者はFONT PLUSなど有償Webフォントサービスが採用しており、後者はGoogleフォントが採用している
有償だけあり、前者の方が後者よりも表示速度が速く使い勝手がよい
ただし、有償Webフォントサービスは利用規約によって用途を制限されている点に注意が必要だ
Vivliostyle Pubで無条件にこれらのサービスが利用できるわけではない
また、クラウドにインストールされたフォント（フォント2）と同じものをローカルにインストールし（フォント1）、それを指定するのも有効だ

## おわりに

[^1]: https://github.com/vivliostyle/vivliostyle-pub
[^2]: https://vivliostyle-pub-develop.vercel.app/
[^3]: https://github.com/vivliostyle/vivliostyle.js 
[^4]: プレビューのレスポンス向上のため組版エンジンをローカルにおくのは、Vivliostyle Pubの前身である@spring-raining氏によるViola（https://github.com/violapub/viola ）に由来する。ただし、ViolaにはまだPDFの出力機能は実装されていなかった。
[^5]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/
[^6]: https://github.com/ogwata/tbf13-draft
[^7]: 原稿（Markdownファイル）の一部分だけフォントや文字サイズを変えたい場合、HTMLの`span`要素や`div`要素の属性としてスタイル情報を指定することができる。その他、外部スタイルシートでなく、文書の冒頭で`style`要素を使ってスタイル情報を記述することもできる。いずれにせよUIというようなものでなく、この辺りは今後の課題ではある。
[^8]: https://github.com/vivliostyle/themes
[^9]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/functions-of-the-actions-menu/theme
[^10]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/create-and-save-documents/how-to-specify-fonts
[^11]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/create-and-save-documents/additional-information-on-fonts#%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%81%AB%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E4%B8%80%E8%A6%A7


