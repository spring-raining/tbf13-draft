# Vivliostyle Pubがフォントを指定するしくみ

小形克宏（一般社団法人ビブリオスタイル理事）

## はじめに

Vivliostyle Pub[^1]は、「誰でもCSS組版を楽しめること」を目指して開発されたWebアプリだ。面倒なインストールやコマンドラインによる操作は不要、ネットに{繫|つな}がったブラウザさえあればCSS組版で本を作ることができる。一昨年から開発が進められてきたが、ようやく今年4月にアルファ版を公開するところまで辿り着いた。まだまだ開発途中ではあるが、一人でも多くのユーザに使っていただき、可能ならフィードバックしてもらえればと思っている[^2]。

![図1 アルファ版公開がはじまったVivliostyle Pub](content/ogwata/image/fig-1.png)
![図1 アルファ版公開がはじまったVivliostyle Pub](./content/ogwata/image/fig-1.png)
![図1 アルファ版公開がはじまったVivliostyle Pub](/content/ogwata/image/fig-1.png)

さて、そのVivliostyle Pubだが、組版エンジン（Vivliostyle.js[^3]）がプレビュー用はローカル、PDF出力用はクライドという具合に、別々の場所に実装されている。後で詳しく述べるが、これはユーザの使い心地に直結するプレビュー表示を少しでも早くするためだ[^4]。

ところが、組版エンジンを分離させた結果、ユーザが意識しないままプレビューとPDF出力とでフォントが変わってしまうケースが起こり得るようになった。もしフォントが違えば、プレビューとPDF出力とで行数やページ数が違ってしまう。

ただし仮に食い違っても、それはCSSにおける`font-family`の指定に従ってフォールバックした結果であり、その意味ではユーザーが指定した動作にすぎない。とはいえ、同人誌印刷では1ページ違えば印刷料金が変わることもあり得る。知らないうちにレビューとPDF出力とでページが異なれば、ユーザは不信感を持ってしまうだろう。

この問題はいずれ解決するべきとは思うが、アーキテクチャの深い部分に関わるものであり、すぐには無理と思われる。本稿においてVivliostyle Pubがどのようにフォントを扱っているのかを詳しく説明することで、ユーザーの混乱を少しでも解消し、より多くの人がVivliostyle Pubを使ってもらう契機にできればと考えた。少しの間、お付き合いいただければ幸いである。

なお、本稿の内容は、筆者が主に担当した「Vivliostyle Pubユーザガイド」[^5]の一部を、一貫した読み物として再構成したものであることをお断りしておく。それから、本稿はVivliostyle Pubで執筆した。

## Themeによるフォント指定


## Vivliostyle Pubで扱えるフォントの種類

## プレビューとPDF出力におけるフォントを指定するしくみ

## プレビューとPDF出力でフォントを一致させる方法


## おわりに

[^1]: https://github.com/vivliostyle/vivliostyle-pub
[^2]: https://vivliostyle-pub-develop.vercel.app/
[^3]: https://github.com/vivliostyle/vivliostyle.js 
[^4]: プレビューのレスポンス向上のため組版エンジンをローカルにおくのは、Vivliostyle Pubの前身である@spring-raining氏によるViola（https://github.com/violapub/viola ）に由来する。ただし、ViolaにはまだPDFの出力機能は実装されていなかった。
[^5]: https://vivliostyle.github.io/docs-vivliostyle-pub/#/ja/