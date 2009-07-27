/*
 * drauti - drawing utility
 *
 * The MIT License
 * 
 * Copyright (c) 2009 Hiroaki Nakamura <hnakamur@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var drauti = (function() {
  function def(target, src) {
    for (var k in src)
      target[k] = src[k];
    return target;
  }

  function inherit(targetClass, protoObject) {
    targetClass._super = protoObject.constructor;
    targetClass.prototype = protoObject;
    targetClass.prototype._super = protoObject.constructor.prototype;
    targetClass.prototype.constructor = targetClass;
  }

  ////////////////////
  // Font: immutable
  ////////////////////

  /**
   * Font constructor.
   * @params properties font properties.
   *                    Mandantory keys are 'size' and 'family'.
   *                    Optional keys are 'style', 'variant', 'weight',  and 'lineHeight'.
   */
  function Font(properties) {
    this.size = properties.size;
    this.family = properties.family;
    this.names = Font.parseFamily(this.family);

    this.style = properties.style;
    this.variant = properties.variant;
    this.weight = properties.weight;
    this.lineHeight = properties.lineHeight;
  }
  def(Font, (function() {
    var sizeAndFamilyRegExp = /\s*([^/ ]+)\s*(?:\/\s*(\S+))?\s+((?:\w+|'[^']+'|"[^"]")(?:,.*)?)$/,
      fontNameRegExp = /^(\S+|'[^']+'|"[^"]+")(?:,\s*)?/,
      LineMetrics = {
        "Serif":{h:1,a:0.75,d:0.25},
        "SansSerif":{h:1.177734,a:0.966797,d:0.210938},
        "Monospaced":{h:1,a:0.753906,d:0.246094},
        "Dialog":{h:1.177734,a:0.966797,d:0.210938},
        "DialogInput":{h:1.177734,a:0.966797,d:0.210938},
        "AlBayan":{h:1.5,a:0.991,d:0.509},
        "AlBayan-Bold":{h:1.655,a:0.991,d:0.564},
        "AmericanTypewriter":{h:1.154,a:0.904,d:0.25},
        "AmericanTypewriter-Bold":{h:1.226,a:0.948,d:0.278},
        "AmericanTypewriter-Condensed":{h:1.154,a:0.904,d:0.25},
        "AmericanTypewriter-CondensedBold":{h:1.226,a:0.948,d:0.278},
        "AmericanTypewriter-CondensedLight":{h:1.154,a:0.904,d:0.25},
        "AmericanTypewriter-Light":{h:1.154,a:0.904,d:0.25},
        "AndaleMono":{h:1.125,a:0.907227,d:0.217773},
        "Apple-Chancery":{h:1.58252,a:1.117676,d:0.464844},
        "AppleBraille":{h:1.114746,a:0.78125,d:0.25},
        "AppleBraille-Outline6Dot":{h:1.114746,a:0.78125,d:0.25},
        "AppleBraille-Outline8Dot":{h:1.114746,a:0.78125,d:0.25},
        "AppleBraille-Pinpoint6Dot":{h:1.114746,a:0.78125,d:0.25},
        "AppleBraille-Pinpoint8Dot":{h:1.114746,a:0.78125,d:0.25},
        "AppleGothic":{h:1.216,a:0.891,d:0.325},
        "AppleMyungjo":{h:1.1875,a:0.870117,d:0.317383},
        "AppleSymbols":{h:1,a:0.666504,d:0.25},
        "Arial-Black":{h:1.410156,a:1.100586,d:0.30957},
        "Arial-BoldItalicMT":{h:1.149902,a:0.905273,d:0.211914},
        "Arial-BoldMT":{h:1.149902,a:0.905273,d:0.211914},
        "Arial-ItalicMT":{h:1.149902,a:0.905273,d:0.211914},
        "ArialHebrew":{h:1.065918,a:0.730469,d:0.335449},
        "ArialHebrew-Bold":{h:1.065918,a:0.730469,d:0.335449},
        "ArialMT":{h:1.149902,a:0.905273,d:0.211914},
        "ArialNarrow":{h:1.147461,a:0.935547,d:0.211914},
        "ArialNarrow-Bold":{h:1.147461,a:0.935547,d:0.211914},
        "ArialNarrow-BoldItalic":{h:1.147461,a:0.935547,d:0.211914},
        "ArialNarrow-Italic":{h:1.147461,a:0.935547,d:0.211914},
        "ArialRoundedMTBold":{h:1.157227,a:0.946289,d:0.210938},
        "ArialUnicodeMS":{h:1.339844,a:1.068848,d:0.270996},
        "Ayuthaya":{h:1.388095,a:1.067143,d:0.320952},
        "Baghdad":{h:1.364258,a:0.917969,d:0.446289},
        "Baskerville":{h:1.144043,a:0.897949,d:0.246094},
        "Baskerville-Bold":{h:1.151367,a:0.896484,d:0.254883},
        "Baskerville-BoldItalic":{h:1.129395,a:0.879883,d:0.249512},
        "Baskerville-Italic":{h:1.126953,a:0.880859,d:0.246094},
        "Baskerville-SemiBold":{h:1.151367,a:0.896484,d:0.254883},
        "Baskerville-SemiBoldItalic":{h:1.129395,a:0.879883,d:0.249512},
        "BigCaslon-Medium":{h:1.209,a:0.934,d:0.257},
        "BrushScriptMT":{h:1.226563,a:0.888672,d:0.337891},
        "Chalkboard":{h:1.276243,a:0.98011,d:0.282873},
        "Chalkboard-Bold":{h:1.276243,a:0.98011,d:0.282873},
        "CharcoalCY":{h:1.333496,a:1,d:0.25},
        "Cochin":{h:1.147,a:0.897,d:0.25},
        "Cochin-Bold":{h:1.164,a:0.914,d:0.25},
        "Cochin-BoldItalic":{h:1.149,a:0.915,d:0.234},
        "Cochin-Italic":{h:1.12,a:0.886,d:0.234},
        "ComicSansMS":{h:1.393555,a:1.102051,d:0.291504},
        "ComicSansMS-Bold":{h:1.393555,a:1.102051,d:0.291504},
        "Copperplate":{h:1.03,a:0.763,d:0.248},
        "Copperplate-Bold":{h:1.035,a:0.767,d:0.248},
        "Copperplate-Light":{h:1.03,a:0.763,d:0.248},
        "CorsivaHebrew":{h:0.932617,a:0.625,d:0.307617},
        "CorsivaHebrew-Bold":{h:0.932617,a:0.625,d:0.307617},
        "Courier":{h:1,a:0.753906,d:0.246094},
        "Courier-Bold":{h:1,a:0.753906,d:0.246094},
        "Courier-BoldOblique":{h:1,a:0.753906,d:0.246094},
        "Courier-Oblique":{h:1,a:0.753906,d:0.246094},
        "CourierNewPS-BoldItalicMT":{h:1.132813,a:0.83252,d:0.300293},
        "CourierNewPS-BoldMT":{h:1.132813,a:0.83252,d:0.300293},
        "CourierNewPS-ItalicMT":{h:1.132813,a:0.83252,d:0.300293},
        "CourierNewPSMT":{h:1.132813,a:0.83252,d:0.300293},
        "DFKaiShu-SB-Estd-BF":{h:1.025,a:0.86,d:0.165},
        "DecoTypeNaskh":{h:1.814298,a:1.17524,d:0.639058},
        "DevanagariMT":{h:1.60791,a:0.925293,d:0.682617},
        "DevanagariMT-Bold":{h:1.60791,a:0.925293,d:0.682617},
        "Didot":{h:1.264,a:0.941,d:0.299},
        "Didot-Bold":{h:1.289,a:0.969,d:0.294},
        "Didot-Italic":{h:1.257,a:0.942,d:0.29},
        "EuphemiaUCAS":{h:1.36084,a:1.092285,d:0.227539},
        "EuphemiaUCAS-Bold":{h:1.36084,a:1.092285,d:0.227539},
        "EuphemiaUCAS-Italic":{h:1.36084,a:1.092285,d:0.227539},
        "Futura-CondensedExtraBold":{h:1.300781,a:1.003418,d:0.27002},
        "Futura-CondensedMedium":{h:1.328125,a:1.038574,d:0.259766},
        "Futura-Medium":{h:1.328125,a:1.038574,d:0.259766},
        "Futura-MediumItalic":{h:1.330566,a:1.038086,d:0.263184},
        "GB18030Bitmap":{h:1.25,a:1.125,d:0.125},
        "GeezaPro":{h:1.177734,a:0.966797,d:0.210938},
        "GeezaPro-Bold":{h:1.177734,a:0.966797,d:0.210938},
        "Geneva":{h:1.333496,a:1,d:0.25},
        "GenevaCY":{h:1.333496,a:1,d:0.25},
        "Georgia":{h:1.13623,a:0.916992,d:0.219238},
        "Georgia-Bold":{h:1.13623,a:0.916992,d:0.219238},
        "Georgia-BoldItalic":{h:1.13623,a:0.916992,d:0.219238},
        "Georgia-Italic":{h:1.13623,a:0.916992,d:0.219238},
        "GillSans":{h:1.148438,a:0.917969,d:0.230469},
        "GillSans-Bold":{h:1.157715,a:0.922852,d:0.234863},
        "GillSans-BoldItalic":{h:1.155762,a:0.920898,d:0.234863},
        "GillSans-Italic":{h:1.13916,a:0.90918,d:0.22998},
        "GillSans-Light":{h:1.148438,a:0.917969,d:0.230469},
        "GillSans-LightItalic":{h:1.13916,a:0.90918,d:0.22998},
        "GujaratiMT":{h:1.540527,a:0.908203,d:0.632324},
        "GujaratiMT-Bold":{h:1.540527,a:0.908203,d:0.632324},
        "Helvetica":{h:1,a:0.77002,d:0.22998},
        "Helvetica-Bold":{h:1,a:0.77002,d:0.22998},
        "Helvetica-BoldOblique":{h:1,a:0.77002,d:0.22998},
        "Helvetica-Oblique":{h:1,a:0.77002,d:0.22998},
        "HelveticaCYBold":{h:1.031738,a:0.729004,d:0.219238},
        "HelveticaCYBoldOblique":{h:1.031738,a:0.729004,d:0.219238},
        "HelveticaCYOblique":{h:1.031738,a:0.729004,d:0.219238},
        "HelveticaCYPlain":{h:1.031738,a:0.729004,d:0.219238},
        "HelveticaNeue":{h:1.193,a:0.952,d:0.213},
        "HelveticaNeue-Bold":{h:1.221,a:0.975,d:0.217},
        "HelveticaNeue-BoldItalic":{h:1.221,a:0.975,d:0.217},
        "HelveticaNeue-CondensedBlack":{h:1.193,a:0.952,d:0.213},
        "HelveticaNeue-CondensedBold":{h:1.221,a:0.975,d:0.217},
        "HelveticaNeue-Italic":{h:1.198,a:0.957,d:0.213},
        "HelveticaNeue-Light":{h:1.193,a:0.952,d:0.213},
        "HelveticaNeue-LightItalic":{h:1.198,a:0.957,d:0.213},
        "HelveticaNeue-UltraLight":{h:1.193,a:0.952,d:0.213},
        "HelveticaNeue-UltraLightItalic":{h:1.198,a:0.957,d:0.213},
        "Herculanum":{h:1,a:0.795,d:0.205},
        "HiraKakuPro-W3":{h:1.5,a:0.88,d:0.12},
        "HiraKakuPro-W6":{h:1.5,a:0.88,d:0.12},
        "HiraKakuProN-W3":{h:1.5,a:0.88,d:0.12},
        "HiraKakuProN-W6":{h:1.5,a:0.88,d:0.12},
        "HiraKakuStd-W8":{h:1.5,a:0.88,d:0.12},
        "HiraKakuStdN-W8":{h:1.5,a:0.88,d:0.12},
        "HiraMaruPro-W4":{h:1.5,a:0.88,d:0.12},
        "HiraMaruProN-W4":{h:1.5,a:0.88,d:0.12},
        "HiraMinPro-W3":{h:1.5,a:0.88,d:0.12},
        "HiraMinPro-W6":{h:1.5,a:0.88,d:0.12},
        "HiraMinProN-W3":{h:1.5,a:0.88,d:0.12},
        "HiraMinProN-W6":{h:1.5,a:0.88,d:0.12},
        "HoeflerText-Black":{h:1,a:0.721,d:0.279},
        "HoeflerText-BlackItalic":{h:1,a:0.721,d:0.279},
        "HoeflerText-Italic":{h:1,a:0.721,d:0.279},
        "HoeflerText-Ornaments":{h:1,a:0.721,d:0.279},
        "HoeflerText-Regular":{h:1,a:0.721,d:0.279},
        "IPAGothic":{h:1,a:0.88,d:0.12},
        "IPAMincho":{h:1,a:0.88,d:0.12},
        "IPAMonaPGothic":{h:1,a:0.875,d:0.125},
        "IPAPGothic":{h:1,a:0.88,d:0.12},
        "IPAPMincho":{h:1,a:0.88,d:0.12},
        "Impact":{h:1.219727,a:1.008789,d:0.210938},
        "InaiMathi":{h:1.25,a:0.85,d:0.4},
        "JCHEadA":{h:1.007813,a:0.799805,d:0.208008},
        "JCfg":{h:1.008789,a:0.799805,d:0.208984},
        "JCkg":{h:1.008789,a:0.799805,d:0.208984},
        "JCsmPC":{h:1.008789,a:0.799805,d:0.208984},
        "Kailasa":{h:1.293846,a:0.844231,d:0.449615},
        "Kokonor":{h:1.673846,a:1.043846,d:0.613846},
        "Krungthep":{h:1.339844,a:1.010547,d:0.2625},
        "KufiStandardGK":{h:1.410156,a:0.943359,d:0.466797},
        "LiGothicMed":{h:1,a:0.833,d:0.167},
        "LiHeiPro":{h:1,a:0.86,d:0.14},
        "LiSongPro":{h:1,a:0.86,d:0.14},
        "LiSungLight":{h:1,a:0.833,d:0.167},
        "Lucida Bright Demibold":{h:1.164063,a:0.950684,d:0.213379},
        "Lucida Bright Demibold Italic":{h:1.164063,a:0.950684,d:0.213379},
        "Lucida Bright Italic":{h:1.164063,a:0.950684,d:0.213379},
        "Lucida Bright Regular":{h:1.164063,a:0.950684,d:0.213379},
        "Lucida Sans Demibold":{h:1.163574,a:0.952637,d:0.210938},
        "Lucida Sans Regular":{h:1.163574,a:0.950195,d:0.213379},
        "Lucida Sans Typewriter Bold":{h:1.15625,a:0.945313,d:0.210938},
        "Lucida Sans Typewriter Regular":{h:1.164063,a:0.950684,d:0.213379},
        "LucidaBright":{h:1.164063,a:0.950684,d:0.213379},
        "LucidaBright-Demi":{h:1.164063,a:0.950684,d:0.213379},
        "LucidaBright-DemiItalic":{h:1.164063,a:0.950684,d:0.213379},
        "LucidaBright-Italic":{h:1.164063,a:0.950684,d:0.213379},
        "LucidaGrande":{h:1.177734,a:0.966797,d:0.210938},
        "LucidaGrande-Bold":{h:1.177734,a:0.966797,d:0.210938},
        "LucidaSans":{h:1.163574,a:0.950195,d:0.213379},
        "LucidaSans-Demi":{h:1.163574,a:0.952637,d:0.210938},
        "LucidaSans-Typewriter":{h:1.15625,a:0.945313,d:0.210938},
        "LucidaSans-TypewriterBold":{h:1.15625,a:0.945313,d:0.210938},
        "MarkerFelt-Thin":{h:1.086,a:0.868,d:0.218},
        "MarkerFelt-Wide":{h:1.086,a:0.868,d:0.218},
        "MicrosoftSansSerif":{h:1.131836,a:0.921875,d:0.209961},
        "Monaco":{h:1.333496,a:1,d:0.25},
        "MonotypeGurmukhi":{h:1.303711,a:0.864258,d:0.439453},
        "Mshtakan":{h:1.149902,a:0.891113,d:0.216309},
        "MshtakanBold":{h:1.149902,a:0.891113,d:0.216309},
        "MshtakanBoldOblique":{h:1.149902,a:0.891113,d:0.216309},
        "MshtakanOblique":{h:1.149902,a:0.891113,d:0.216309},
        "Nadeem":{h:1.371094,a:0.917969,d:0.453125},
        "NewPeninimMT":{h:1.023438,a:0.727051,d:0.296387},
        "NewPeninimMT-Bold":{h:1.023438,a:0.727051,d:0.296387},
        "NewPeninimMT-BoldInclined":{h:1.023438,a:0.727051,d:0.296387},
        "NewPeninimMT-Inclined":{h:1.023438,a:0.727051,d:0.296387},
        "Optima-Bold":{h:1.214,a:0.921,d:0.268},
        "Optima-BoldItalic":{h:1.217,a:0.931,d:0.261},
        "Optima-ExtraBlack":{h:1.212,a:0.919,d:0.268},
        "Optima-Italic":{h:1.21,a:0.923,d:0.262},
        "Optima-Regular":{h:1.212,a:0.919,d:0.268},
        "Osaka":{h:1.417969,a:1,d:0.25},
        "Osaka-Mono":{h:1.417969,a:1,d:0.25},
        "Papyrus":{h:1.542969,a:0.939941,d:0.603027},
        "Papyrus-Condensed":{h:1.542969,a:0.939941,d:0.603027},
        "PlantagenetCherokee":{h:1.056,a:0.697,d:0.285},
        "Raanana":{h:1,a:0.71582,d:0.28418},
        "RaananaBold":{h:1,a:0.71582,d:0.28418},
        "SIL-Hei-Med-Jian":{h:1,a:0.799805,d:0.200195},
        "SIL-Kai-Reg-Jian":{h:1,a:0.799805,d:0.200195},
        "STFangsong":{h:1,a:0.86,d:0.14},
        "STHeiti":{h:1,a:0.86,d:0.14},
        "STKaiti":{h:1.02,a:0.86,d:0.16},
        "STSong":{h:1,a:0.86,d:0.14},
        "STXihei":{h:1,a:0.86,d:0.14},
        "Sathu":{h:1.273155,a:0.903454,d:0.317111},
        "Silom":{h:1.275,a:0.959,d:0.316},
        "Skia-Regular":{h:1,a:0.776855,d:0.223145},
        "Symbol":{h:1,a:0.701172,d:0.298828},
        "Tahoma":{h:1.207031,a:1.000488,d:0.206543},
        "Tahoma-Bold":{h:1.207031,a:1.000488,d:0.206543},
        "Thonburi":{h:1.376562,a:1.081641,d:0.228125},
        "Thonburi-Bold":{h:1.376562,a:1.081641,d:0.228125},
        "Times-Bold":{h:1,a:0.75,d:0.25},
        "Times-BoldItalic":{h:1,a:0.75,d:0.25},
        "Times-Italic":{h:1,a:0.75,d:0.25},
        "Times-Roman":{h:1,a:0.75,d:0.25},
        "TimesNewRomanPS-BoldItalicMT":{h:1.149902,a:0.891113,d:0.216309},
        "TimesNewRomanPS-BoldMT":{h:1.149902,a:0.891113,d:0.216309},
        "TimesNewRomanPS-ItalicMT":{h:1.149902,a:0.891113,d:0.216309},
        "TimesNewRomanPSMT":{h:1.149902,a:0.891113,d:0.216309},
        "Trebuchet-BoldItalic":{h:1.161133,a:0.938965,d:0.222168},
        "TrebuchetMS":{h:1.161133,a:0.938965,d:0.222168},
        "TrebuchetMS-Bold":{h:1.161133,a:0.938965,d:0.222168},
        "TrebuchetMS-Italic":{h:1.161133,a:0.938965,d:0.222168},
        "Verdana":{h:1.215332,a:1.005371,d:0.209961},
        "Verdana-Bold":{h:1.215332,a:1.005371,d:0.209961},
        "Verdana-BoldItalic":{h:1.215332,a:1.005371,d:0.209961},
        "Verdana-Italic":{h:1.215332,a:1.005371,d:0.209961},
        "Webdings":{h:1,a:0.799805,d:0.200195},
        "Wingdings-Regular":{h:1.109863,a:0.898926,d:0.210938},
        "Wingdings2":{h:1.054199,a:0.843262,d:0.210938},
        "Wingdings3":{h:1.138672,a:0.927734,d:0.210938},
        "ZapfDingbatsITC":{h:0.990723,a:0.813965,d:0.176758},
        "Zapfino":{h:3.3775,a:1.875,d:1.5025}
      };

    // parse
    //   spec: [style || variant || weight]? size ('/' lineHeight)? family [',' family]*
    //   family: \w+ | '[^']+' | "[^"]+"
    function parse(fontProperty) {
      var m = fontProperty.match(sizeAndFamilyRegExp);
      if (!m)
        throw new Error("Invalid fontProperty");
      var properties = {
        size: m[1],
        lineHeight: m[2],
        family: m[3]
      };
      var optionsLen = fontProperty.length - m[0].length;
      if (optionsLen > 0) {
        var options = fontProperty.substr(0, optionsLen).split(/\s+/);
        var rest;
        for (var i = 0, len = options.length; i < len; i++) {
          var option = options[i];
          switch (option) {
          case 'italic':
          case 'oblique':
            properties.style = option;
            break;
          case 'small-caps':
            properties.variant = option;
            break;
          case 'bold':
          case 'bolder':
          case 'lighter': 
          case '100':
          case '200':
          case '300':
          case '400':
          case '500':
          case '600':
          case '700':
          case '800':
          case '900':
            properties.weight = option;
            break;
          case 'normal':
          case 'inherit':
            if (!rest)
              rest = option;
            else if (option != rest)
              throw new Error("Cannot mix 'normal' and 'inherit' because I cannot determine which property (style, variant, or weight).");
            break;
          default:
            throw new Error("Invalid style, variant or weight value.");
            break;
          }
        }
      }
      return new Font(properties);
    }

    function parseFamily(family) {
      var names = [];
      var rest = family;
      while (rest.length > 0) {
        var m = rest.match(fontNameRegExp);
        if (m) {
          var name = m[1];
          names.push('\'"'.indexOf(name.charAt(0)) != -1 ? name.slice(1, -1) : name);
          rest = rest.substring(m[0].length);
        }
        else
          throw new Error("Invalid family format.");
      }
      return names;
    }

    function formatFamily(names) {
      var values = [];
      for (var i = 0, len = names.length; i < len; i++) {
        var name = names[i];
        values.push(name.indexOf(' ') != -1 ? "'" + name + "'" : name);
      }
      return values.join(', ');
    }

    return {
      LineMetrics: LineMetrics,
      parse: parse,
      parseFamily: parseFamily,
      formatFamily: formatFamily
    };
  })());
  def(Font.prototype, {
    toString: function toString() {
      var words = [];
      if (this.style)
        words.push(this.style);
      if (this.variant)
        words.push(this.variant);
      if (this.weight)
        words.push(this.weight);
      words.push(this.lineHeight ? this.size + '/' + this.lineHeight : this.size);
      words.push(this.family);
      return words.join(' ');
    },
    measureText: function measureText(text) {
      var doc = document,
        body = doc.body,
        div = doc.createElement("div");
      div.setAttribute("style",
        "padding:0;margin:0;visibility:hidden;position:absolute;top:0;left:0;font:" + this.toString());
      div.appendChild(doc.createTextNode(text));

      body.appendChild(div);
      var size = {
        width: div.clientWidth,
        height: div.clientHeight
      };
      body.removeChild(div);
      return size;
    }
  });

  function StringUtil() {}
  def(StringUtil, (function() {
    function leftPad(str, length, padding) {
      var pad = padding || ' ',
        count = (length - str.length) / pad.length;
      if (count > 0) {
        var chunks = [];
        while (count-- > 0)
          chunks.push(pad);
        chunks.push(str);
        return chunks.join('');
      }
      else
        return str;
    }

    function zeroPad(str, length) {
      return leftPad(str, length, '0');
    }

    function toHex(n, length) {
      var s = n.toString(16);
      return length ? zeroPad(s, length) : s;
    }

    return {
      leftPad: leftPad,
      zeroPad: zeroPad,
      toHex: toHex
    };
  })());

  function MathUtil() {}
  def(MathUtil, (function() {
    function clipByRange(value, min, max) {
      return Math.max(Math.min(value, max), min);
    }

    return {
      clipByRange: clipByRange
    };
  })());

  function AngleUtil() {}
  def(AngleUtil, {
    normalizeDegree: function normalizeDegree(degree) {
      return ((degree % 360) + 360) % 360;
    }
  });

  ///////////////////////////////////////
  // RgbColor: @immutable
  ///////////////////////////////////////

  /**
   * RgbColor constructor.
   * @param {red} red component. fraction:0.0~1.0
   * @param {green} green component. fraction:0.0~1.0
   * @param {blue} blue component. fraction:0.0~1.0
   */
  function RgbColor(red, green, blue) {
    this.red = MathUtil.clipByRange(red, 0, 1);
    this.green = MathUtil.clipByRange(green, 0, 1);
    this.blue = MathUtil.clipByRange(blue, 0, 1);
  }
  def(RgbColor, (function() {
    function _componentToInt(component) {
      return Math.round(255 * component);
    }

    function _componentToHex(component) {
      return StringUtil.toHex(_componentToInt(component), 2);
    }

    return {
      _componentToInt: _componentToInt,
      _componentToHex: _componentToHex
    };
  })());
  def(RgbColor.prototype, {
    toPercentString: function toPercentString() {
      return [
        'rgb(',
        [
          ColorUtil._componentToPercent(this.red),
          ColorUtil._componentToPercent(this.green),
          ColorUtil._componentToPercent(this.blue)
        ].join(', '),
        ')'
      ].join('');
    },
    toIntRangeString: function toIntRangeString() {
      return [
        'rgb(',
        [
          RgbColor._componentToInt(this.red),
          RgbColor._componentToInt(this.green),
          RgbColor._componentToInt(this.blue)
        ].join(', '),
        ')'
      ].join('');
    },
    toHashString: function toHashString() {
      return [
        '#',
        RgbColor._componentToHex(this.red),
        RgbColor._componentToHex(this.green),
        RgbColor._componentToHex(this.blue)
      ].join('');
    },
    toString: function toString() {
      return this.toPercentString();
    }
  });

  ///////////////////////////////////////
  // RgbaColor: @immutable
  ///////////////////////////////////////

  /**
   * RgbaColor constructor.
   * @param {red} red component. fraction:0.0~1.0
   * @param {green} green component. fraction:0.0~1.0
   * @param {blue} blue component. fraction:0.0~1.0
   * @param {alpha} alpha component. fraction number:0.0~1.0
   */
  function RgbaColor(red, green, blue, alpha) {
    this.red = MathUtil.clipByRange(red, 0, 1);
    this.green = MathUtil.clipByRange(green, 0, 1);
    this.blue = MathUtil.clipByRange(blue, 0, 1);
    this.alpha = MathUtil.clipByRange(alpha, 0, 1);
  }
  def(RgbaColor.prototype, {
    toPercentString: function toPercentString() {
      return [
        'rgba(',
        [
          ColorUtil._componentToPercent(this.red),
          ColorUtil._componentToPercent(this.green),
          ColorUtil._componentToPercent(this.blue),
          this.alpha
        ].join(', '),
        ')'
      ].join('');
    },
    toIntRangeString: function toIntRangeString() {
      return [
        'rgba(',
        [
          RgbColor._componentToInt(this.red),
          RgbColor._componentToInt(this.green),
          RgbColor._componentToInt(this.blue),
          this.alpha
        ].join(', '),
        ')'
      ].join('');
    },
    toString: function toString() {
      return this.toPercentString();
    }
  });

  ///////////////////////////////////////
  // HslColor: @immutable
  ///////////////////////////////////////

  /**
   * HslColor constructor.
   * @param {hue} hue component in degrees.
   * @param {saturation} saturation component. fraction:0.0~1.0
   * @param {lightness} lightness component. fraction:0.0~1.0
   * @param {alpha} alpha component. fraction:0.0~1.0
   */
  function HslColor(hue, saturation, lightness) {
    this.hue = AngleUtil.normalizeDegree(hue);
    this.saturation = MathUtil.clipByRange(saturation, 0, 1);
    this.lightness = MathUtil.clipByRange(lightness, 0, 1);
  }
  def(HslColor.prototype, (function() {
    function toRgbColor() {
      var s = this.saturation,
        l = this.lightness,
        q = l < 0.5 ? l * (1 + s) : l + s - l * s,
        p = 2 * l - q,
        h = this.hue / 360,
        tr = h + 1 / 3,
        tg = h,
        tb = h - 1 / 3;
      return new RgbColor(
        _convertColorComp(tr, p, q),
        _convertColorComp(tg, p, q),
        _convertColorComp(tb, p, q)
      );
    }

    function _convertColorComp(c, p, q) {
      if (c < 0)
        c = c + 1;
      if (c > 1)
        c = c - 1;
      if (c < 1 / 6)
        return p + (q - p) * 6 * c;
      else if (c < 1 / 2)
        return q;
      else if (c < 2 / 3)
        return p + (q - p) * 6 * (2 / 3 - c);
      else
        return p;
    }

    function toString() {
      return [
        'hsl(',
        [
          this.hue,
          ColorUtil._componentToPercent(this.saturation),
          ColorUtil._componentToPercent(this.lightness)
        ].join(', '),
        ')'
      ].join('');
    }

    return {
      toRgbColor: toRgbColor,
      toString: toString
    }
  })());

  ///////////////////////////////////////
  // HslaColor: @immutable
  ///////////////////////////////////////

  /**
   * HslaColor constructor.
   * @param {hue} hue component in degrees.
   * @param {saturation} saturation component. fraction:0.0~1.0
   * @param {lightness} lightness component. fraction:0.0~1.0
   * @param {alpha} alpha component. fraction:0.0~1.0
   */
  function HslaColor(hue, saturation, lightness, alpha) {
    this.hue = AngleUtil.normalizeDegree(hue);
    this.saturation = MathUtil.clipByRange(saturation, 0, 1);
    this.lightness = MathUtil.clipByRange(lightness, 0, 1);
    this.alpha = MathUtil.clipByRange(alpha, 0, 1);
  }
  def(HslaColor.prototype, (function() {
    function toRgbaColor() {
      var rgb = new HslColor(this.hue, this.saturation, this.lightness).
        toRgbColor();
      return new RgbaColor(rgb.red, rgb.green, rgb.blue, this.alpha);
    }

    function toString() {
      return [
        'hsla(',
        [
          this.hue,
          ColorUtil._componentToPercent(this.saturation),
          ColorUtil._componentToPercent(this.lightness),
          this.alpha
        ].join(', '),
        ')'
      ].join('');
    }

    return {
      toRgbaColor: toRgbaColor,
      toString: toString
    }
  })());

  function ColorUtil() {}
  def(ColorUtil, (function() {
    var hashThreeDigitRgbRegExp = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i,
      hashSixDigitRgbRegExp = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
      rgbParenRegExp = /^rgb\(\s*(-?(?:(?:\d+(?:\.\d*)?|\.\d+)%|\d+))\s*,\s*(-?(?:(?:\d+(?:\.\d*)?|\.\d+)%|\d+))\s*,\s*(-?(?:(?:\d+(?:\.\d*)?|\.\d+)%|\d+))\s*\)$/,
      rgbaParenRegExp = /^rgba\(\s*(-?(?:(?:\d+(?:\.\d*)?|\.\d+)%|\d+))\s*,\s*(-?(?:(?:\d+(?:\.\d*)?|\.\d+)%|\d+))\s*,\s*(-?(?:(?:\d+(?:\.\d*)?|\.\d+)%|\d+))\s*\,\s*(-?(?:\d+(?:\.\d*)|\.\d+))\s*\)$/,
      hslParenRegExp = /^hsl\(\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d*)?|\.\d+)%)\s*,\s*(-?(?:\d+(?:\.\d*)?|\.\d+)%)\s*\)$/,
      hslaParenRegExp = /^hsla\(\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d*)?|\.\d+)%)\s*,\s*(-?(?:\d+(?:\.\d*)?|\.\d+)%)\s*\),\s*(-?(?:\d+(?:\.\d*)|\.\d+))\s*\)$/;

    function parse(colorStr) {
      var m;
      switch (colorStr.charAt(0)) {
        case '#':
          m = colorStr.match(hashSixDigitRgbRegExp);
          if (m) {
            return new RgbColor(
              parseInt(m[1], 16) / 255,
              parseInt(m[2], 16) / 255,
              parseInt(m[3], 16) / 255
            );
          }
          m = colorStr.match(hashThreeDigitRgbRegExp);
          if (m) {
            return new RgbColor(
              parseInt(m[1] + m[1], 16) / 255,
              parseInt(m[2] + m[2], 16) / 255,
              parseInt(m[3] + m[3], 16) / 255
            );
          }
          break;
        case 'r':
          m = colorStr.match(rgbParenRegExp);
          if (m) {
            return new RgbColor(
              parseFloat(m[1]) / 100,
              parseFloat(m[2]) / 100,
              parseFloat(m[3]) / 100
            );
          }
          m = colorStr.match(rgbaParenRegExp);
          if (m) {
            return new RgbaColor(
              parseFloat(m[1]) / 100,
              parseFloat(m[2]) / 100,
              parseFloat(m[3]) / 100,
              parseFloat(m[4])
            );
          }
          break;
        case 'h':
          m = colorStr.match(hslParenRegExp);
          if (m) {
            return new HslColor(
              parseFloat(m[1]),
              parseFloat(m[2]) / 100,
              parseFloat(m[3]) / 100
            );
          }
          m = colorStr.match(hslaParenRegExp);
          if (m) {
            return new HslaColor(
              parseFloat(m[1]),
              parseFloat(m[2]) / 100,
              parseFloat(m[3]) / 100,
              parseFloat(m[4])
            );
          }
          break;
      }
      throw new Error("Invalid color string");
    }

    function _componentToPercent(component) {
      return (100 * component).toFixed(1).replace(/\.0*$/, '') + '%';
    }

    return {
      parse: parse,
      _componentToPercent: _componentToPercent
    };
  })());

  ///////////////////////////////////////
  // Point: @immutable
  ///////////////////////////////////////

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }
  def(Point.prototype, {
    translate: function translate(dx, dy) {
      return new Point(this.x + dx, this.y + dy);
    },
    distance: function distance(point) {
      var dx = point.x - this.x,
        dy = point.y - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  });

  ///////////////////////////////////////
  // Transform: @immutable
  ///////////////////////////////////////

  function Transform(m11, m12, m21, m22, dx, dy) {
    this.m11 = m11;
    this.m12 = m12;
    this.m21 = m21;
    this.m22 = m22;
    this.dx = dx;
    this.dy = dy;
  }
  def(Transform, {
    createIdentity: function createIdentity() {
      return new Transform(1, 0, 0, 1, 0, 0);
    },
    createTranslate: function createTranslate(dx, dy) {
      return new Transform(1, 0, 0, 1, dx, dy);
    },
    createScale: function createScale(sx, sy) {
      return new Transform(sx, 0, 0, sy, 0, 0);
    },
    createRotate: function createRotate(radian) {
      var c = Math.cos(radian),
        s = Math.sin(radian);
      return new Transform(c, s, -s, c, 0, 0);
    },
    createSkewX: function createSkewX(radian) {
      return new Transform(1, 0, Math.tan(radian), 1, 0, 0);
    },
    createSkewY: function createSkewY(radian) {
      return new Transform(1, Math.tan(radian), 0, 1, 0, 0);
    }
  });
  def(Transform.prototype, {
    concat: function concat(transform) {
      return new Transform(
        this.m11 * transform.m11 + this.m21 * transform.m12,
        this.m12 * transform.m11 + this.m22 * transform.m12,
        this.m11 * transform.m21 + this.m21 * transform.m22,
        this.m12 * transform.m21 + this.m22 * transform.m22,
        this.m11 * transform.dx + this.m21 * transform.dy + this.dx,
        this.m12 * transform.dx + this.m22 * transform.dy + this.dy
      );
    },
    determinant: function determinant() {
      return this.m11 * this.m22 - this.m21 * this.m12;
    },
    invert: function invert() {
      var d = this.determinant();
      return new Transform(
        this.m22 / d,
        -this.m12 / d,
        -this.m21 / d,
        this.m11 / d,
        (this.m21 * this.dy - this.dx * this.m22) / d,
        (this.dx * this.m12 - this.m11 * this.dy) / d
      );
    },
    translate: function translate(dx, dy) {
      return this.concat(Transform.createTranslate(dx, dy));
    },
    scale: function scale(sx, sy) {
      return this.concat(Transform.createScale(sx, sy));
    },
    rotate: function rotate(radian) {
      return this.concat(Transform.createRotate(radian));
    },
    skewX: function skewX(radian) {
      return this.concat(Transform.createSkewX(radian));
    },
    skewY: function skewY(radian) {
      return this.concat(Transform.createSkewY(radian));
    },
    transformPoint: function transformPoint(point) {
      return new Point(
        this.m11 * point.x + this.m21 * point.y + this.dx,
        this.m12 * point.x + this.m22 * point.y + this.dy
      );
    }
  });

  function Shape() {
    this.children = [];
  }

  def(Shape.prototype, {
    draw: function(ctx) {}
  });

  return {
    def: def,
    inherit: inherit,
    StringUtil: StringUtil,
    MathUtil: MathUtil,
    AngleUtil: AngleUtil,
    ColorUtil: ColorUtil,
    RgbColor: RgbColor,
    RgbaColor: RgbaColor,
    HslColor: HslColor,
    HslaColor: HslaColor,
    Font: Font,
    Point: Point,
    Transform: Transform,
    Shape: Shape,
  };
})();
