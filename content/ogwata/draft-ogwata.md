# Vivliostyle Pubがフォントを指定する仕組み

小形克宏（一般社団法人ビブリオスタイル理事）

## はじめに

Vivliostyle Pub[^1]は、「誰でもCSS組版を楽しめるプロダクト」を目指して開発されたWebアプリだ。面倒なインストールやコマンドラインによる操作は不要、ネットに{繫|つな}がったブラウザさえあればCSS組版で本を作ることができる。一昨年から開発が進められてきたが、ようやく今年4月にアルファ版を公開するところまできた。まだまだ開発途中ではあるが、一人でも多くのユーザーに使っていただき、可能ならフィードバックしてもらえるとありがたい[^2]。

![図1 アルファ版公開がはじまったVivliostyle Pub](./image/fig-1.png){width=400}

さて、そのVivliostyle Pubだが、組版エンジン（Vivliostyle.js[^3]）がプレビュー用はローカル、PDF出力用はクラウドという具合いに、別々の場所に実装されている。その仕組みは後で詳しく述べるが、このようにした理由はユーザーの使い心地に直結するプレビュー表示を、少しでも早くしたいからだ[^4]。

ところが、組版エンジンを分離させた結果、ユーザーが意識しないままプレビューとPDF出力とでフォントが食い違うことが起こり得るようになった。もし両者のフォントが違えば、プレビューとPDF出力とで行数やページ数が違ってしまう。

とはいえ、食い違ってもそれはCSSにおける`font-family`の指定に従ってフォールバックした結果であり、その意味ではユーザーが指定した動作にすぎない。それでも、同人誌印刷では1ページ違えば印刷料金が変わることもある。知らないうちにプレビューとPDF出力でページが異なってしまえば、ユーザーは不信感を持つだろう。

この問題はいずれ解決するべきとは思うが、アーキテクチャの深い部分に関わるものであり、すぐには無理と思われる。本稿ではVivliostyle Pubがどのようにフォントを扱っているのかを詳しく説明する。これによりユーザーの混乱を少しでも防ぎ、より多くの人にVivliostyle Pubを使ってもらえればと思う。少しの間、お付き合いいただければ幸いだ。

なお、本稿の内容は、筆者が主に担当した「Vivliostyle Pubユーザーガイド」[^5]の一部を、一連の読み物として再構成したものであることをお断りしておく。参考のために、対応するユーザーガイドのセクションを〈　〉で示している。それから、本稿はVivliostyle Pubで執筆した[^6]。

## フォントを指定する方法

Vivliostyle Pubでは、どのようにしてフォントや文字サイズを指定するのだろうか？　残念ながら、既存ワードプロセッサのようにテキストを選択し、その部分のフォントや文字サイズを指定するようなGUIはまだなく[^7]、別途スタイルシートの中でそれらを指定するという間接的な方法をとっている。

利用できるスタイルシートは下記の3種類だ。

1. **Plain theme：**ブラウザのデフォルトスタイルシートにもとづく必要最低限のもの
2. **Vivliostyle公式theme：**npmパッケージとして公開されているスタイルシート[^8]
3. **Custom theme：**ユーザーが自分で書いたCSSスタイルシート

いずれもActionメニューと呼ばれるプルダウンメニューの中から選択することができる〈Actionメニューの機能 > Theme（スタイル情報の選択）[^9]〉。

上記1で使用されるフォントは、使っているブラウザで設定されたデフォルトフォントだ。もっともPlain themeは手っ取り早くプレビューを確認するためのものであり、出力は想定していない。

上記2のVivliostyle公式themeのそれぞれで指定されている`font-family`は下記の通り。

- Book theme for latin font……`Georgia, serif;`[^10]
- 文庫用のテーマ……`"游明朝", "YuMincho", serif;`[^11]
- Slide theme……`'Noto', 'YuGothic', 'Yu Gothic', 'Meiryo', sans-serif;`[^12]
- Techbook (技術同人誌) theme……`'Neue Frutiger World', 'Verdana',  'Hiragino Sans', sans-serif;`[^13]
- Academic theme……`'Hiragino Mincho ProN', serif;`[^14]


## 利用可能なフォントとそれらを扱う仕組み

Vivliostyle Pubが利用できるフォントは、以下のようにフォントがおかれた場所ごとに3種類に分別できる。〈文書の作成と保存 > フォントの指定方法[^10]〉

- ユーザーのPCにあるローカルフォント（**フォント1**）
- クラウドにインストールされたフォント（**フォント2**）
- Webフォントサービスのフォント（**フォント3**）

一見して分かるとおり、ユーザーのPC（ローカル）

上記のうち**フォント2**のリストはユーザーガイド〈文書の作成と保存 > フォントに関する補足情報 > クラウドにインストールされているフォント一覧[^11]〉にまとめてあるので参考にしてほしい。

それでは、上記3種類のフォントを使って、どのようにしてVivliostyle Pubはプレビューしたり、PDF出力したりしているのだろう？　まずプレビューにおけるフォントを扱う仕組みを図示してみよう（図2）

![図2　プレビューにおけるフォント使用](./image/fig-2.png){width=400}

注意してほしいのは、プレビューのために組版をおこなうVivliostyle.js（赤い四角）は、ユーザーのPC上のフロントエンドにあるということ。したがってVivliostyle.jsと同じユーザーのPCにある**フォント1**、及びWebフォントサービスの**フォント3**がプレビューで利用できる。他方、クラウドにインストールされた**フォント2**はこの図には見当たらず、したがってプレビューで**フォント2**は利用できないわけである。

次にPDF出力におけるフォントを指定する仕組みを見てほしい（図3）。

![図3　PDF出力におけるフォント使用](./image/fig-3.png){width=400}




以上をまとめてみよう。

- ユーザーのPCにあるローカルフォント（**フォント1**）はプレビューだけで使える
- クラウドにインストールされたフォント（**フォント2**）はPDF出力だけで使える
- Webフォントサービスのフォント（**フォント3**）はプレビューでもPDF出力でも使える


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
[^8]: https://vivliostyle.github.io/themes/#/ja/gallery
[^9]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/functions-of-the-actions-menu/theme
[^10]: https://github.com/vivliostyle/themes/tree/master/packages/%40vivliostyle/theme-gutenberg
[^11]: https://github.com/vivliostyle/themes/tree/master/packages/%40vivliostyle/theme-bunko
[^12]: https://github.com/vivliostyle/themes/tree/master/packages/%40vivliostyle/theme-slide
[^13]: https://github.com/vivliostyle/themes/tree/master/packages/%40vivliostyle/theme-techbook
[^14]: https://github.com/vivliostyle/themes/tree/master/packages/%40vivliostyle/theme-academic
[^15]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/create-and-save-documents/how-to-specify-fonts
[^16]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/create-and-save-documents/additional-information-on-fonts#%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%81%AB%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E4%B8%80%E8%A6%A7



