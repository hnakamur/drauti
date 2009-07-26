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
        "Serif":{a:0.75,d:0.25,l:0},
        "SansSerif":{a:0.966797,d:0.210938,l:0},
        "Monospaced":{a:0.753906,d:0.246094,l:0},
        "Dialog":{a:0.966797,d:0.210938,l:0},
        "DialogInput":{a:0.966797,d:0.210938,l:0},
        "AlBayan":{a:0.991,d:0.509,l:0},
        "AlBayan-Bold":{a:0.991,d:0.564,l:0.1},
        "AmericanTypewriter":{a:0.904,d:0.25,l:0},
        "AmericanTypewriter-Bold":{a:0.948,d:0.278,l:0},
        "AmericanTypewriter-Condensed":{a:0.904,d:0.25,l:0},
        "AmericanTypewriter-CondensedBold":{a:0.948,d:0.278,l:0},
        "AmericanTypewriter-CondensedLight":{a:0.904,d:0.25,l:0},
        "AmericanTypewriter-Light":{a:0.904,d:0.25,l:0},
        "AndaleMono":{a:0.907227,d:0.217773,l:0},
        "Apple-Chancery":{a:1.117676,d:0.464844,l:0},
        "AppleBraille":{a:0.78125,d:0.25,l:0.083496},
        "AppleBraille-Outline6Dot":{a:0.78125,d:0.25,l:0.083496},
        "AppleBraille-Outline8Dot":{a:0.78125,d:0.25,l:0.083496},
        "AppleBraille-Pinpoint6Dot":{a:0.78125,d:0.25,l:0.083496},
        "AppleBraille-Pinpoint8Dot":{a:0.78125,d:0.25,l:0.083496},
        "AppleGothic":{a:0.891,d:0.325,l:0},
        "AppleMyungjo":{a:0.870117,d:0.317383,l:0},
        "AppleSymbols":{a:0.666504,d:0.25,l:0.083496},
        "Arial-Black":{a:1.100586,d:0.30957,l:0},
        "Arial-BoldItalicMT":{a:0.905273,d:0.211914,l:0.032715},
        "Arial-BoldMT":{a:0.905273,d:0.211914,l:0.032715},
        "Arial-ItalicMT":{a:0.905273,d:0.211914,l:0.032715},
        "ArialHebrew":{a:0.730469,d:0.335449,l:0},
        "ArialHebrew-Bold":{a:0.730469,d:0.335449,l:0},
        "ArialMT":{a:0.905273,d:0.211914,l:0.032715},
        "ArialNarrow":{a:0.935547,d:0.211914,l:0},
        "ArialNarrow-Bold":{a:0.935547,d:0.211914,l:0},
        "ArialNarrow-BoldItalic":{a:0.935547,d:0.211914,l:0},
        "ArialNarrow-Italic":{a:0.935547,d:0.211914,l:0},
        "ArialRoundedMTBold":{a:0.946289,d:0.210938,l:0},
        "ArialUnicodeMS":{a:1.068848,d:0.270996,l:0},
        "Ayuthaya":{a:1.067143,d:0.320952,l:0},
        "Baghdad":{a:0.917969,d:0.446289,l:0},
        "Baskerville":{a:0.897949,d:0.246094,l:0},
        "Baskerville-Bold":{a:0.896484,d:0.254883,l:0},
        "Baskerville-BoldItalic":{a:0.879883,d:0.249512,l:0},
        "Baskerville-Italic":{a:0.880859,d:0.246094,l:0},
        "Baskerville-SemiBold":{a:0.896484,d:0.254883,l:0},
        "Baskerville-SemiBoldItalic":{a:0.879883,d:0.249512,l:0},
        "BigCaslon-Medium":{a:0.934,d:0.257,l:0.018},
        "BrushScriptMT":{a:0.888672,d:0.337891,l:0},
        "Chalkboard":{a:0.98011,d:0.282873,l:0.01326},
        "Chalkboard-Bold":{a:0.98011,d:0.282873,l:0.01326},
        "CharcoalCY":{a:1,d:0.25,l:0.083496},
        "Cochin":{a:0.897,d:0.25,l:0},
        "Cochin-Bold":{a:0.914,d:0.25,l:0},
        "Cochin-BoldItalic":{a:0.915,d:0.234,l:0},
        "Cochin-Italic":{a:0.886,d:0.234,l:0},
        "ComicSansMS":{a:1.102051,d:0.291504,l:0},
        "ComicSansMS-Bold":{a:1.102051,d:0.291504,l:0},
        "Copperplate":{a:0.763,d:0.248,l:0.019},
        "Copperplate-Bold":{a:0.767,d:0.248,l:0.02},
        "Copperplate-Light":{a:0.763,d:0.248,l:0.019},
        "CorsivaHebrew":{a:0.625,d:0.307617,l:0},
        "CorsivaHebrew-Bold":{a:0.625,d:0.307617,l:0},
        "Courier":{a:0.753906,d:0.246094,l:0},
        "Courier-Bold":{a:0.753906,d:0.246094,l:0},
        "Courier-BoldOblique":{a:0.753906,d:0.246094,l:0},
        "Courier-Oblique":{a:0.753906,d:0.246094,l:0},
        "CourierNewPS-BoldItalicMT":{a:0.83252,d:0.300293,l:0},
        "CourierNewPS-BoldMT":{a:0.83252,d:0.300293,l:0},
        "CourierNewPS-ItalicMT":{a:0.83252,d:0.300293,l:0},
        "CourierNewPSMT":{a:0.83252,d:0.300293,l:0},
        "DFKaiShu-SB-Estd-BF":{a:0.86,d:0.165,l:0},
        "DecoTypeNaskh":{a:1.17524,d:0.639058,l:0},
        "DevanagariMT":{a:0.925293,d:0.682617,l:0},
        "DevanagariMT-Bold":{a:0.925293,d:0.682617,l:0},
        "Didot":{a:0.941,d:0.299,l:0.024},
        "Didot-Bold":{a:0.969,d:0.294,l:0.026},
        "Didot-Italic":{a:0.942,d:0.29,l:0.025},
        "EuphemiaUCAS":{a:1.092285,d:0.227539,l:0.041016},
        "EuphemiaUCAS-Bold":{a:1.092285,d:0.227539,l:0.041016},
        "EuphemiaUCAS-Italic":{a:1.092285,d:0.227539,l:0.041016},
        "Futura-CondensedExtraBold":{a:1.003418,d:0.27002,l:0.027344},
        "Futura-CondensedMedium":{a:1.038574,d:0.259766,l:0.029785},
        "Futura-Medium":{a:1.038574,d:0.259766,l:0.029785},
        "Futura-MediumItalic":{a:1.038086,d:0.263184,l:0.029297},
        "GB18030Bitmap":{a:1.125,d:0.125,l:0},
        "GeezaPro":{a:0.966797,d:0.210938,l:0},
        "GeezaPro-Bold":{a:0.966797,d:0.210938,l:0},
        "Geneva":{a:1,d:0.25,l:0.083496},
        "GenevaCY":{a:1,d:0.25,l:0.083496},
        "Georgia":{a:0.916992,d:0.219238,l:0},
        "Georgia-Bold":{a:0.916992,d:0.219238,l:0},
        "Georgia-BoldItalic":{a:0.916992,d:0.219238,l:0},
        "Georgia-Italic":{a:0.916992,d:0.219238,l:0},
        "GillSans":{a:0.917969,d:0.230469,l:0},
        "GillSans-Bold":{a:0.922852,d:0.234863,l:0},
        "GillSans-BoldItalic":{a:0.920898,d:0.234863,l:0},
        "GillSans-Italic":{a:0.90918,d:0.22998,l:0},
        "GillSans-Light":{a:0.917969,d:0.230469,l:0},
        "GillSans-LightItalic":{a:0.90918,d:0.22998,l:0},
        "GujaratiMT":{a:0.908203,d:0.632324,l:0},
        "GujaratiMT-Bold":{a:0.908203,d:0.632324,l:0},
        "Helvetica":{a:0.77002,d:0.22998,l:0},
        "Helvetica-Bold":{a:0.77002,d:0.22998,l:0},
        "Helvetica-BoldOblique":{a:0.77002,d:0.22998,l:0},
        "Helvetica-Oblique":{a:0.77002,d:0.22998,l:0},
        "HelveticaCYBold":{a:0.729004,d:0.219238,l:0.083496},
        "HelveticaCYBoldOblique":{a:0.729004,d:0.219238,l:0.083496},
        "HelveticaCYOblique":{a:0.729004,d:0.219238,l:0.083496},
        "HelveticaCYPlain":{a:0.729004,d:0.219238,l:0.083496},
        "HelveticaNeue":{a:0.952,d:0.213,l:0.028},
        "HelveticaNeue-Bold":{a:0.975,d:0.217,l:0.029},
        "HelveticaNeue-BoldItalic":{a:0.975,d:0.217,l:0.029},
        "HelveticaNeue-CondensedBlack":{a:0.952,d:0.213,l:0.028},
        "HelveticaNeue-CondensedBold":{a:0.975,d:0.217,l:0.029},
        "HelveticaNeue-Italic":{a:0.957,d:0.213,l:0.028},
        "HelveticaNeue-Light":{a:0.952,d:0.213,l:0.028},
        "HelveticaNeue-LightItalic":{a:0.957,d:0.213,l:0.028},
        "HelveticaNeue-UltraLight":{a:0.952,d:0.213,l:0.028},
        "HelveticaNeue-UltraLightItalic":{a:0.957,d:0.213,l:0.028},
        "Herculanum":{a:0.795,d:0.205,l:0},
        "HiraKakuPro-W3":{a:0.88,d:0.12,l:0.5},
        "HiraKakuPro-W6":{a:0.88,d:0.12,l:0.5},
        "HiraKakuProN-W3":{a:0.88,d:0.12,l:0.5},
        "HiraKakuProN-W6":{a:0.88,d:0.12,l:0.5},
        "HiraKakuStd-W8":{a:0.88,d:0.12,l:0.5},
        "HiraKakuStdN-W8":{a:0.88,d:0.12,l:0.5},
        "HiraMaruPro-W4":{a:0.88,d:0.12,l:0.5},
        "HiraMaruProN-W4":{a:0.88,d:0.12,l:0.5},
        "HiraMinPro-W3":{a:0.88,d:0.12,l:0.5},
        "HiraMinPro-W6":{a:0.88,d:0.12,l:0.5},
        "HiraMinProN-W3":{a:0.88,d:0.12,l:0.5},
        "HiraMinProN-W6":{a:0.88,d:0.12,l:0.5},
        "HoeflerText-Black":{a:0.721,d:0.279,l:0},
        "HoeflerText-BlackItalic":{a:0.721,d:0.279,l:0},
        "HoeflerText-Italic":{a:0.721,d:0.279,l:0},
        "HoeflerText-Ornaments":{a:0.721,d:0.279,l:0},
        "HoeflerText-Regular":{a:0.721,d:0.279,l:0},
        "IPAGothic":{a:0.88,d:0.12,l:0},
        "IPAMincho":{a:0.88,d:0.12,l:0},
        "IPAMonaPGothic":{a:0.875,d:0.125,l:0},
        "IPAPGothic":{a:0.88,d:0.12,l:0},
        "IPAPMincho":{a:0.88,d:0.12,l:0},
        "Impact":{a:1.008789,d:0.210938,l:0},
        "InaiMathi":{a:0.85,d:0.4,l:0},
        "JCHEadA":{a:0.799805,d:0.208008,l:0},
        "JCfg":{a:0.799805,d:0.208984,l:0},
        "JCkg":{a:0.799805,d:0.208984,l:0},
        "JCsmPC":{a:0.799805,d:0.208984,l:0},
        "Kailasa":{a:0.844231,d:0.449615,l:0},
        "Kokonor":{a:1.043846,d:0.613846,l:0.016154},
        "Krungthep":{a:1.010547,d:0.2625,l:0.066797},
        "KufiStandardGK":{a:0.943359,d:0.466797,l:0},
        "LiGothicMed":{a:0.833,d:0.167,l:0},
        "LiHeiPro":{a:0.86,d:0.14,l:0},
        "LiSongPro":{a:0.86,d:0.14,l:0},
        "LiSungLight":{a:0.833,d:0.167,l:0},
        "Lucida Bright Demibold":{a:0.950684,d:0.213379,l:0},
        "Lucida Bright Demibold Italic":{a:0.950684,d:0.213379,l:0},
        "Lucida Bright Italic":{a:0.950684,d:0.213379,l:0},
        "Lucida Bright Regular":{a:0.950684,d:0.213379,l:0},
        "Lucida Sans Demibold":{a:0.952637,d:0.210938,l:0},
        "Lucida Sans Regular":{a:0.950195,d:0.213379,l:0},
        "Lucida Sans Typewriter Bold":{a:0.945313,d:0.210938,l:0},
        "Lucida Sans Typewriter Regular":{a:0.950684,d:0.213379,l:0},
        "LucidaBright":{a:0.950684,d:0.213379,l:0},
        "LucidaBright-Demi":{a:0.950684,d:0.213379,l:0},
        "LucidaBright-DemiItalic":{a:0.950684,d:0.213379,l:0},
        "LucidaBright-Italic":{a:0.950684,d:0.213379,l:0},
        "LucidaGrande":{a:0.966797,d:0.210938,l:0},
        "LucidaGrande-Bold":{a:0.966797,d:0.210938,l:0},
        "LucidaSans":{a:0.950195,d:0.213379,l:0},
        "LucidaSans-Demi":{a:0.952637,d:0.210938,l:0},
        "LucidaSans-Typewriter":{a:0.945313,d:0.210938,l:0},
        "LucidaSans-TypewriterBold":{a:0.945313,d:0.210938,l:0},
        "MarkerFelt-Thin":{a:0.868,d:0.218,l:0},
        "MarkerFelt-Wide":{a:0.868,d:0.218,l:0},
        "MicrosoftSansSerif":{a:0.921875,d:0.209961,l:0},
        "Monaco":{a:1,d:0.25,l:0.083496},
        "MonotypeGurmukhi":{a:0.864258,d:0.439453,l:0},
        "Mshtakan":{a:0.891113,d:0.216309,l:0.04248},
        "MshtakanBold":{a:0.891113,d:0.216309,l:0.04248},
        "MshtakanBoldOblique":{a:0.891113,d:0.216309,l:0.04248},
        "MshtakanOblique":{a:0.891113,d:0.216309,l:0.04248},
        "Nadeem":{a:0.917969,d:0.453125,l:0},
        "NewPeninimMT":{a:0.727051,d:0.296387,l:0},
        "NewPeninimMT-Bold":{a:0.727051,d:0.296387,l:0},
        "NewPeninimMT-BoldInclined":{a:0.727051,d:0.296387,l:0},
        "NewPeninimMT-Inclined":{a:0.727051,d:0.296387,l:0},
        "Optima-Bold":{a:0.921,d:0.268,l:0.025},
        "Optima-BoldItalic":{a:0.931,d:0.261,l:0.025},
        "Optima-ExtraBlack":{a:0.919,d:0.268,l:0.025},
        "Optima-Italic":{a:0.923,d:0.262,l:0.025},
        "Optima-Regular":{a:0.919,d:0.268,l:0.025},
        "Osaka":{a:1,d:0.25,l:0.167969},
        "Osaka-Mono":{a:1,d:0.25,l:0.167969},
        "Papyrus":{a:0.939941,d:0.603027,l:0},
        "Papyrus-Condensed":{a:0.939941,d:0.603027,l:0},
        "PlantagenetCherokee":{a:0.697,d:0.285,l:0.074},
        "Raanana":{a:0.71582,d:0.28418,l:0},
        "RaananaBold":{a:0.71582,d:0.28418,l:0},
        "SIL-Hei-Med-Jian":{a:0.799805,d:0.200195,l:0},
        "SIL-Kai-Reg-Jian":{a:0.799805,d:0.200195,l:0},
        "STFangsong":{a:0.86,d:0.14,l:0},
        "STHeiti":{a:0.86,d:0.14,l:0},
        "STKaiti":{a:0.86,d:0.16,l:0},
        "STSong":{a:0.86,d:0.14,l:0},
        "STXihei":{a:0.86,d:0.14,l:0},
        "Sathu":{a:0.903454,d:0.317111,l:0.05259},
        "Silom":{a:0.959,d:0.316,l:0},
        "Skia-Regular":{a:0.776855,d:0.223145,l:0},
        "Symbol":{a:0.701172,d:0.298828,l:0},
        "Tahoma":{a:1.000488,d:0.206543,l:0},
        "Tahoma-Bold":{a:1.000488,d:0.206543,l:0},
        "Thonburi":{a:1.081641,d:0.228125,l:0.066797},
        "Thonburi-Bold":{a:1.081641,d:0.228125,l:0.066797},
        "Times-Bold":{a:0.75,d:0.25,l:0},
        "Times-BoldItalic":{a:0.75,d:0.25,l:0},
        "Times-Italic":{a:0.75,d:0.25,l:0},
        "Times-Roman":{a:0.75,d:0.25,l:0},
        "TimesNewRomanPS-BoldItalicMT":{a:0.891113,d:0.216309,l:0.04248},
        "TimesNewRomanPS-BoldMT":{a:0.891113,d:0.216309,l:0.04248},
        "TimesNewRomanPS-ItalicMT":{a:0.891113,d:0.216309,l:0.04248},
        "TimesNewRomanPSMT":{a:0.891113,d:0.216309,l:0.04248},
        "Trebuchet-BoldItalic":{a:0.938965,d:0.222168,l:0},
        "TrebuchetMS":{a:0.938965,d:0.222168,l:0},
        "TrebuchetMS-Bold":{a:0.938965,d:0.222168,l:0},
        "TrebuchetMS-Italic":{a:0.938965,d:0.222168,l:0},
        "Verdana":{a:1.005371,d:0.209961,l:0},
        "Verdana-Bold":{a:1.005371,d:0.209961,l:0},
        "Verdana-BoldItalic":{a:1.005371,d:0.209961,l:0},
        "Verdana-Italic":{a:1.005371,d:0.209961,l:0},
        "Webdings":{a:0.799805,d:0.200195,l:0},
        "Wingdings-Regular":{a:0.898926,d:0.210938,l:0},
        "Wingdings2":{a:0.843262,d:0.210938,l:0},
        "Wingdings3":{a:0.927734,d:0.210938,l:0},
        "ZapfDingbatsITC":{a:0.813965,d:0.176758,l:0},
        "Zapfino":{a:1.875,d:1.5025,l:0}
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
    function lPad(str, length, padding) {
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
      return lPad(str, length, '0');
    }

    function toHex(n, length) {
      return zeroPad(n.toString(16), length);
    }

    return {
      lPad: lPad,
      zeroPad: zeroPad,
      toHex: toHex
    };
  })());

  function MathUtil() {}
  def(MathUtil, (function() {
    function clip(value, min, max) {
      return Math.max(Math.min(value, max), min);
    }

    return {
      clip: clip
    };
  })());

  ///////////////////////////////////////
  // RgbColor: @immutable
  ///////////////////////////////////////

  /**
   * RgbColor constructor.
   * @param red : red component (0-255)
   * @param green : green component (0-255)
   * @param blue : blue component (0-255)
   */
  function RgbColor(red, green, blue) {
    this.red = MathUtil.clip(red, 0, 255);
    this.green = MathUtil.clip(green, 0, 255);
    this.blue = MathUtil.clip(blue, 0, 255);
  }
  def(RgbColor, (function() {
    var threeDigitRgbRegExp = /#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])/,
      sixDigitRgbRegExp = /#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/,
      rgbIntegerRegExp = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/,
      rgbPercentRegExp = /rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/;

    function parseHex(s) {
      return parseInt(s, 16);
    }

    function fromString(color) {
      var m = color.match(sixDigitRgbRegExp);
      if (m)
        return new RgbColor(parseHex(m[1]), parseHex(m[2]), parseHex(m[3]));

      m = color.match(threeDigitRgbRegExp);
      if (m) {
        return new RgbColor(
          parseHex(m[1] + m[1]),
          parseHex(m[2] + m[2]),
          parseHex(m[3] + m[3])
        );
      }

      m = color.match(rgbIntegerRegExp);
      if (m)
        return new RgbColor(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));

      m = color.match(rgbPercentRegExp);
      if (m)
        return fromFractions(m[1] / 100, m[2] / 100, m[3] / 100);

      throw new Error('Invalid color string');
    }

    function fromFractions(red, green, blue) {
      return new RgbColor(
        Math.round(255 * red),
        Math.round(255 * green),
        Math.round(255 * blue)
      );
    }

    return {
      fromString: fromString,
      fromFractions: fromFractions
    };
  })());
  def(RgbColor.prototype, {
    toString: function toString() {
      return [
        '#',
        StringUtil.toHex(this.red, 2),
        StringUtil.toHex(this.green, 2),
        StringUtil.toHex(this.blue, 2)
      ].join('');
    }
  });

  ///////////////////////////////////////
  // HsbColor: @immutable
  ///////////////////////////////////////

  /**
   * HsbColor constructor.
   */
  function HsbColor(hue, saturation, brightness) {
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
  }
  def(HsbColor.prototype, {
    toRgbColor: function toRgbColor() {
      var h = this.hue,
        s = this.saturation,
        b = this.brightness,
        h60 = h / 60,
        ih60 = Math.floor(h60),
        hi = ih60 % 6,
        f = h60 - ih60,
        p = b * (1 - s),
        q = b * (1 - f * s);
        t = b * (1 - (1 - f) * s);
      switch (hi) {
        case 0: return RgbColor.fromFractions(b, t, p);
        case 1: return RgbColor.fromFractions(q, b, p);
        case 2: return RgbColor.fromFractions(p, b, t);
        case 3: return RgbColor.fromFractions(p, q, b);
        case 4: return RgbColor.fromFractions(t, p, b);
        case 5: return RgbColor.fromFractions(b, p, q);
      }
    }
  });

  ///////////////////////////////////////
  // HslColor: @immutable
  ///////////////////////////////////////

  /**
   * HslColor constructor.
   */
  function HslColor(hue, saturation, lightness) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
  }
  def(HslColor.prototype, (function() {
    function adjustTc(tc) {
      return tc < 0 ? tc + 1 : tc > 1 ? tc - 1 : tc;
    }

    function toRgbColor() {
      var h = this.hue,
        s = this.saturation,
        l = this.lightness,
        q = l < 0.5 ? l * (1 + s) : l + s - l * s,
        p = 2 * l - q,
        hk = h / 360,
        tr = hk + 1 / 3,
        tg = hk,
        tb = hk - 1 / 3;

      function calcColorComp(tc) {
        if (tc < 1 / 6)
          return p + (q - p) * 6 * tc;
        else if (tc < 1 / 2)
          return q;
        else if (tc < 2 / 3)
          return p + (q - p) * 6 * (2 / 3 - tc);
        else
          return p;
      }

      var r = calcColorComp(adjustTc(tr)),
        g = calcColorComp(adjustTc(tg)),
        b = calcColorComp(adjustTc(tb));
      return RgbColor.fromFractions(r, g, b);
    }

    return {
      toRgbColor: toRgbColor
    }
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
    RgbColor: RgbColor,
    HsbColor: HsbColor,
    HslColor: HslColor,
    Font: Font,
    Point: Point,
    Transform: Transform,
    Shape: Shape,
  };
})();
