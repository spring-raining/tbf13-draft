---
title: Vivliostyle.jsにおけるのWeb標準CSSサポートの大改善
author:
  - 村上真雄
---

# Vivliostyle.jsにおけるのWeb標準CSSサポートの大改善

<div class="doc-author">
村上真雄
</div>

## CSS組版で、Webの標準のCSS機能は使えるのが当然でしょ

CSS組版の大きなメリットは、Webの標準のCSSの知識があれば、自分でスタイルシートを作ることが簡単にできることです。
標準のCSSを学ぶための材料はたくさんあります。[MDNサイトのCSS入門](https://developer.mozilla.org/ja/docs/Web/CSS)などお薦めです。

でも、せっかくWebの標準のCSSを覚えたのにそれをCSS組版で使おうとしたら、CSS組版エンジンではそのCSS機能は使えないとなったら、CSS組版へのモチベーションがダダ下がりになりますよね。Webの標準のCSS機能はCSS組版でも使えて当然のはずでしょう。（アニメーション機能など、印刷での再現が無理なものを除けば）

しかし、それが問題でした。

## これまで不満だったVivliostyle.jsでのWeb標準のCSSサポート

CSS組版エンジンVivliostyle.jsの大きな特徴は、標準のWebブラウザ上で動くJavaScriptプログラムとして実現されており、CSSでのレイアウトの機能の多くはブラウザでサポートされているCSSの機能を利用して、それだけでは足りないところを独自に実装しているということです。

このような方式なので、Vivliostyle.jsがサポートするCSSの機能はブラウザがサポートするCSSの機能を包含するスーパーセットであるべきなのですが、現実はそうなっていなくて、ブラウザでは標準で使えるのにVivliostyle.jsでは使えない機能が多々あるという残念な問題がありました。

最近までVivliostyle.jsで使えなかったCSSの機能の例：

- [CSS変数（カスタムプロパティ）](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Grid Layout](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Grids)
- [CSS Colors Level 4](https://www.w3.org/TR/css-color-4/)の色の関数の新しい形式
  - 例: `color: rgb(50% 60% 80% / 50%);`
- [CSSの一括指定プロパティ `all` やデフォルト値を指定するキーワード `initial`、`unset`、`revert`](https://developer.mozilla.org/ja/docs/Web/CSS/all)

など。（これらは最近やっと使えるようになりました！）

## ブラウザのCSS機能をそのまま活かすのが簡単でない理由

もしブラウザにCSSプロパティやCSSルールの構文を拡張するための標準のしくみがあれば、ブラウザのCSS機能をそのまま保ちながら足りないCSS機能を追加できそうですが、残念ながらまだそれがありません（[CSS Houdini](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Houdini)というブラウザのAPIのセットの開発が進められていて、将来的にはそれが役に立ちそうですが、現時点では使えません）。そのためVivliostyle.jsでは、CSSの機能を拡張するために、CSSの構文解析やカスケーディングの処理、CSSプロパティやその値の指定が正しいかどうかを判定する処理などを自前で行う必要がありました。

Vivliostyle.jsのベースになっている[Peter Sorotokin氏によるEPUB Adaptive Layout実装](https://github.com/sorotokin/adaptive-layout/)が作られたのは2013年ごろです。Vivliostyle.jsでのCSSの処理は、この古いプログラムを引き継いで、CSS組版に必要なCSSの機能を拡充させていったものです。それから今までCSSの標準仕様とブラウザでのそのサポートはだいぶ進んでいるのに、Vivliostyle.jsでそれをすぐに反映させることができず、だいぶギャップが生じていました。その結果として、ブラウザで使える最新のCSSの機能がなかなかVivliostyle.jsで使えるようにならない問題が起きていたのです。

## ブラウザで使えるCSSプロパティと値は基本的にすべて使えるようにしました！

最近のVivliostyle.jsの更新（v2.16とv2.17）で、これまでのCSSの処理を見直して、ブラウザで使えるCSSプロパティと値は基本的にすべて使えるように改良しました。Vivliostyle.jsの中にCSSの構文解析やカスケーディングの処理、有効なCSS指定かどうか判定する処理があるのは変わりませんが、Vivliostyle.jsの中で定義されていないCSSプロパティやプロパティの値があったとき、それがブラウザでサポートされているものならば有効なプロパティ指定として生かすようにしたのです。

今後は、ブラウザでサポートされているCSSプロパティやその値が機能しなかったら、それはバグと言えるので[Vivliostyle.jsにバグ報告ください](https://github.com/vivliostyle/vivliostyle.js/issues)。

### これでCSS Grid Layoutが使える！

[CSS Grid Layoutのデモ](https://webkit.org/demos/css-grid/)をVivliostyle CLIのpreviewで表示する例：

```
vivliostyle preview https://webkit.org/demos/css-grid/
```

![CSS Grid Layout ExamplesをVivliostyle CLIのpreviewで表示](images/css-grid.png){width=500}

このように、これまでVivliostyleで使えなかったCSS Grid Layoutが使えるようになりました。

## CSS変数をサポートしました！

[CSS変数（カスタムプロパティ）](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)は、もう何年も前にブラウザで利用可能になって普及していますが、Vivliostyleでは使えない状態でした。CSS組版のスタイルシートをカスタマイズしやすくするために、これがないと不便です。Vivliostyle.js v2.17で、やっと使えるようになりました！

CSS変数は、任意のスタイルルールの中で使用することができて、また、ページを定義する `@page {...}` の中でも使用することができます。次の簡単な例をご覧ください。

```css
:root {
  --page-width: 148mm;
  --page-height: 210mm;
  --page-margin: 20mm;
  --page-header: "My Report";
  --page-footer: counter(page) " / " counter(pages);
}
@page {
  size: var(--page-width) var(--page-height);
  margin: var(--page-margin);
  @top-center {
    content: var(--page-header); 
  }
  @bottom-center {
    content: var(--page-footer); 
  }
}
```

## まだ残っている課題

CSSプロパティのサポートについてはだいぶ改善できました。しかし、最新のブラウザで使えるのにVivliostyleでサポートできてないCSSの機能はまだあります。以下のものなどです：

- `:is()`、`:has()`、`:where()` 擬似クラス
- `::marker`　箇条書きのマークを指定する擬似要素
- `@counter-style`　カウンタースタイルを定義
- `@layer`　カスケードレイヤー

### `:is()`、`:has()`、`:where()` 擬似クラスなどSelectors Level 4サポート（予定）

[CSSセレクター](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Selectors)について、Vivliostyle.jsでは[Selectors Level 3](https://www.w3.org/TR/selectors-3/)の仕様が実装されてますが、最近のブラウザでは[Selectors Level 4](https://www.w3.org/TR/selectors-4/)の仕様の実装が進んでます。それが使えるようになれば、いろいろな条件によってスタイルを変えることがより簡単にできるようになります。

とくに [`:has()` 擬似クラス](https://developer.mozilla.org/ja/docs/Web/CSS/:has)が使えると、画期的に便利になります。従来のCSSセレクターでは、親の要素や前の要素が何であるかによる要素の選択はできても、子要素や後につづく要素が何であるかによって要素を選択することができないことが不便でした。それができるようになります！

`:has()` 擬似クラスの使用例：

```css
section:has(section) {
  /* 内側にも section が存在する section のスタイル */
}
```

```css
h1:has(+ p) {
  /* 段落 p があとに続く見出し h1 のスタイル */
}
```

関連Vivliostyle.js ISSUE:

- [#957 Support for Selectors Level 4](https://github.com/vivliostyle/vivliostyle.js/issues/957)
- [#828 Support the CSS :has() selector](https://github.com/vivliostyle/vivliostyle.js/issues/828)

### `::marker`　箇条書きのマークを指定する擬似要素

[`::marker` 擬似要素](https://developer.mozilla.org/ja/docs/Web/CSS/::marker)は箇条書きの記号や番号のを指定できる擬似要素 `::marker` が使えると、箇条書きのスタイルをより自由にできます（これまでは代わりに `::before` 擬似要素を使って工夫する必要がありましたが、より簡単になります）。

例：箇条書きの番号の色とフォントを変える

```html
<style>
ol > li::marker { color: blue; font: italic 200% sans-serif; }
</style>
<ol>
  <li>あああああ</li>
  <li>いいいいい</li>
  <li>ううううう</li>
</ol>
```

この結果は次のようになるはず：

<figure>
<div><span style="color: blue; font: italic 200% sans-serif;">1. </span>あああああ</div>
<div><span style="color: blue; font: italic 200% sans-serif;">2. </span>いいいいい</div>
<div><span style="color: blue; font: italic 200% sans-serif;">3. </span>ううううう</div>
</figure>

例：番号付きのNOTE

```html
<style>
p.note {
  margin-left: 5em;
  display: list-item;
  counter-increment: note-counter;
}
p.note::marker {
  content: "NOTE " counter(note-counter) ": ";
}
</style>
<p class="note">あああああ</p>
<p class="note">いいいいい</p>
<p class="note">ううううう</p>
```

この結果は次のようになるはず：

<figure>
<p><span>NOTE 1: </span>あああああ</p>
<p><span>NOTE 2: </span>いいいいい</p>
<p><span>NOTE 3: </span>ううううう</p>
</figure>

関連Vivliostyle.js Issue:

- [#732 Support the ::marker CSS pseudo-element](https://github.com/vivliostyle/vivliostyle.js/issues/732)

### `@counter-style`　カウンタースタイルを定義

関連Vivliostyle.js Issue:

- [#731 Support the @counter-style CSS at-rule](https://github.com/vivliostyle/vivliostyle.js/issues/731)

### カスケードレイヤー `@layer`

関連Vivliostyle.js Issue:
- [#977 Support for Cascade Layers (CSS @layer at-rule)](https://github.com/vivliostyle/vivliostyle.js/issues/977)

## CSS組版エンジンとして、もっと実装を進めたいCSS機能

ここまでは、最新のブラウザで使える標準のCSS機能をVivliostyle.jsでサポートすることについて書きました。このブラウザ標準のCSSサポートを進めることと、それで足りない組版のためのCSS機能の実装を進めることは、Vivliostyle.jsをCSS組版エンジンとしてよりよいものにするためにどちらも必要です。

Vivliostyle.jsがサポートしているCSS機能は、Vivliostyleのドキュメント[「サポートするCSS機能」](https://docs.vivliostyle.org/#/ja/supported-css-features)にあります。そのうちVivliostyle.jsで追加実装したCSS仕様の主なものは以下です：

- [CSS Text Level 4](https://www.w3.org/TR/css-text-4/)
  - hanging-punctuationプロパティ——行末の句読点のぶら下げなど
  - text-spacingプロパティ——和欧文間スペースや約物の詰めなど
- [CSS Paged Media Level 3](https://www.w3.org/TR/css-page-3/)
  - ページメディア用CSSの基本仕様
- [CSS Generated Content for Paged Media](https://www.w3.org/TR/css-gcpm-3/)
  - 名前付き文字列（Named strings）——本文中の見出しなどの文字列をページヘッダーに柱として表示するのに使用
  - 脚注（Footnotes）
  - ページセレクター `:nth(An+B)`：n番目のページのスタイルを指定するのに使用
  - `target-counter()`関数——クロスリファレンスや目次・索引などの参照先ページ番号を生成するのに使用
- [CSS Fragmentation Level 3](https://www.w3.org/TR/css-break-3/)
  - 改ページや改ページ禁止の制御など
- [CSS Page Floats](https://www.w3.org/TR/css-page-floats-3/)
  - ページの上部や下部に図版などをフロート配置するページフロートの仕様

以下は、ページメディア用CSSの機能でまだ実装できていない主なもの（Vivliostyle.js Issuesにあるもの）：

- [#734 Support the margin-break property](https://github.com/vivliostyle/vivliostyle.js/issues/734)
  - 仕様: [CSS Fragmentation Level 4 — Adjoining Margins at Breaks: the `margin-break` property](https://www.w3.org/TR/css-break-4/#break-margins)
  - ブロックのマージンがページの先頭になったときに、そのマージンを保持するか0にするかが指定できる。
    - デフォルトの `margin-break: auto` は、なりゆき改ページでページの先頭になったブロックのマージンを破棄
    - `margin-break: keep` はマージンを保持する
    - `margin-break: discard` 強制改ページであってもページの先頭になったブロックのマージンを破棄（0にする）
- [#424 Support for running elements](https://github.com/vivliostyle/vivliostyle.js/issues/424)
  - 仕様: [CSS Generated Content for Paged Media — Running elements](https://www.w3.org/TR/css-gcpm-3/#running-elements)
  - HTML文書内の要素をページマージン領域に柱（欄外見出し）として表示できるようにする機能
  - 単純な文字列だけの柱ならば名前付き文字列（Named strings）で実現できているが、より複雑な要素を柱に表示するのに必要。

## Vivliostyle.jsまだまだ開発途上なのでどうぞよろしく！

以上、Vivliostyle.jsのCSS仕様サポート改善の取り組みについてでした。ここで取り上げていない課題（バグを直すことなど）もたくさんあり、まだまだ開発途上です。

Vivliostyleを使っていると、思い通りの組版結果にならなかったり（それはバグのせいかもしれない）、機能が足りないと感じることがあると思います。ぜひIssue登録してください。そのとき、すでにその問題がIssueに登録されていないか探してみてください。そして、すでにあるIssueだったら、自分もその問題で困っていることなど、コメントをつけたりしてくれると、こちらもそのIssueに取り組みモチベーションが上がります。

Vivliostyle.js Issues: https://github.com/vivliostyle/vivliostyle.js/issues
