export type WordCue = {
  readonly text: string;
  readonly startSec: number;
  readonly startFrame: number;
  readonly endFrame: number;
};

export type SceneAudioData = {
  readonly id: string;
  readonly durationSec: number;
  readonly durationFrames: number;
  readonly words: readonly WordCue[];
};

export const PEARL_HARBOR_AUDIO_DATA: Record<string, SceneAudioData> = {
  "vo-scene1": {
    "id": "vo-scene1",
    "durationSec": 14.42,
    "durationFrames": 433,
    "words": [
      {
        "text": "Jam",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 8
      },
      {
        "text": "tujuh",
        "startSec": 0.215,
        "startFrame": 6,
        "endFrame": 15
      },
      {
        "text": "pagi",
        "startSec": 0.49,
        "startFrame": 15,
        "endFrame": 22
      },
      {
        "text": "di",
        "startSec": 0.734,
        "startFrame": 22,
        "endFrame": 25
      },
      {
        "text": "Hawaii",
        "startSec": 0.825,
        "startFrame": 25,
        "endFrame": 39
      },
      {
        "text": "layar",
        "startSec": 1.598,
        "startFrame": 48,
        "endFrame": 56
      },
      {
        "text": "radar",
        "startSec": 1.882,
        "startFrame": 56,
        "endFrame": 64
      },
      {
        "text": "ini",
        "startSec": 2.126,
        "startFrame": 64,
        "endFrame": 72
      },
      {
        "text": "tiba-tiba",
        "startSec": 2.4,
        "startFrame": 72,
        "endFrame": 86
      },
      {
        "text": "penuh",
        "startSec": 2.858,
        "startFrame": 86,
        "endFrame": 96
      },
      {
        "text": "sama",
        "startSec": 3.203,
        "startFrame": 96,
        "endFrame": 105
      },
      {
        "text": "titik",
        "startSec": 3.488,
        "startFrame": 105,
        "endFrame": 115
      },
      {
        "text": "pesawat",
        "startSec": 3.833,
        "startFrame": 115,
        "endFrame": 129
      },
      {
        "text": "Eh",
        "startSec": 4.453,
        "startFrame": 134,
        "endFrame": 144
      },
      {
        "text": "petugasnya",
        "startSec": 4.983,
        "startFrame": 149,
        "endFrame": 167
      },
      {
        "text": "malah",
        "startSec": 5.568,
        "startFrame": 167,
        "endFrame": 176
      },
      {
        "text": "nyuruh",
        "startSec": 5.88,
        "startFrame": 176,
        "endFrame": 184
      },
      {
        "text": "santai",
        "startSec": 6.122,
        "startFrame": 184,
        "endFrame": 199
      },
      {
        "text": "dikira",
        "startSec": 6.919,
        "startFrame": 208,
        "endFrame": 217
      },
      {
        "text": "itu",
        "startSec": 7.221,
        "startFrame": 217,
        "endFrame": 226
      },
      {
        "text": "rombongan",
        "startSec": 7.524,
        "startFrame": 226,
        "endFrame": 238
      },
      {
        "text": "pesawat",
        "startSec": 7.917,
        "startFrame": 238,
        "endFrame": 248
      },
      {
        "text": "Amerika",
        "startSec": 8.27,
        "startFrame": 248,
        "endFrame": 264
      },
      {
        "text": "sendiri",
        "startSec": 8.794,
        "startFrame": 264,
        "endFrame": 280
      },
      {
        "text": "Padahal",
        "startSec": 9.466,
        "startFrame": 284,
        "endFrame": 299
      },
      {
        "text": "aslinya",
        "startSec": 9.808,
        "startFrame": 294,
        "endFrame": 314
      },
      {
        "text": "itu",
        "startSec": 10.771,
        "startFrame": 323,
        "endFrame": 331
      },
      {
        "text": "gelombang",
        "startSec": 11.037,
        "startFrame": 331,
        "endFrame": 344
      },
      {
        "text": "pertama",
        "startSec": 11.458,
        "startFrame": 344,
        "endFrame": 354
      },
      {
        "text": "seratus",
        "startSec": 11.806,
        "startFrame": 354,
        "endFrame": 369
      },
      {
        "text": "delapan",
        "startSec": 12.298,
        "startFrame": 369,
        "endFrame": 378
      },
      {
        "text": "puluh",
        "startSec": 12.615,
        "startFrame": 378,
        "endFrame": 385
      },
      {
        "text": "tiga",
        "startSec": 12.841,
        "startFrame": 385,
        "endFrame": 394
      },
      {
        "text": "pesawat",
        "startSec": 13.117,
        "startFrame": 394,
        "endFrame": 406
      },
      {
        "text": "tempur",
        "startSec": 13.527,
        "startFrame": 406,
        "endFrame": 416
      },
      {
        "text": "Jepang",
        "startSec": 13.876,
        "startFrame": 416,
        "endFrame": 432
      }
    ]
  },
  "vo-scene2": {
    "id": "vo-scene2",
    "durationSec": 7.941,
    "durationFrames": 239,
    "words": [
      {
        "text": "Emang",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 10
      },
      {
        "text": "kenapa",
        "startSec": 0.279,
        "startFrame": 8,
        "endFrame": 19
      },
      {
        "text": "sih",
        "startSec": 0.617,
        "startFrame": 19,
        "endFrame": 25
      },
      {
        "text": "Jepang",
        "startSec": 0.842,
        "startFrame": 25,
        "endFrame": 36
      },
      {
        "text": "nekat",
        "startSec": 1.201,
        "startFrame": 36,
        "endFrame": 46
      },
      {
        "text": "nyerang",
        "startSec": 1.529,
        "startFrame": 46,
        "endFrame": 53
      },
      {
        "text": "Amerika",
        "startSec": 1.774,
        "startFrame": 53,
        "endFrame": 72
      },
      {
        "text": "Jadi",
        "startSec": 2.529,
        "startFrame": 76,
        "endFrame": 88
      },
      {
        "text": "beberapa",
        "startSec": 2.858,
        "startFrame": 86,
        "endFrame": 95
      },
      {
        "text": "bulan",
        "startSec": 3.17,
        "startFrame": 95,
        "endFrame": 104
      },
      {
        "text": "sebelumnya",
        "startSec": 3.463,
        "startFrame": 104,
        "endFrame": 117
      },
      {
        "text": "di",
        "startSec": 3.906,
        "startFrame": 117,
        "endFrame": 120
      },
      {
        "text": "tahun",
        "startSec": 3.997,
        "startFrame": 120,
        "endFrame": 128
      },
      {
        "text": "empat",
        "startSec": 4.279,
        "startFrame": 128,
        "endFrame": 137
      },
      {
        "text": "satu",
        "startSec": 4.572,
        "startFrame": 137,
        "endFrame": 151
      },
      {
        "text": "Amerika",
        "startSec": 5.358,
        "startFrame": 161,
        "endFrame": 174
      },
      {
        "text": "mutusin",
        "startSec": 5.791,
        "startFrame": 174,
        "endFrame": 187
      },
      {
        "text": "total",
        "startSec": 6.225,
        "startFrame": 187,
        "endFrame": 196
      },
      {
        "text": "pasokan",
        "startSec": 6.527,
        "startFrame": 196,
        "endFrame": 209
      },
      {
        "text": "minyak",
        "startSec": 6.951,
        "startFrame": 209,
        "endFrame": 219
      },
      {
        "text": "ke",
        "startSec": 7.303,
        "startFrame": 219,
        "endFrame": 222
      },
      {
        "text": "Jepang",
        "startSec": 7.394,
        "startFrame": 222,
        "endFrame": 237
      }
    ]
  },
  "vo-scene3": {
    "id": "vo-scene3",
    "durationSec": 10.475,
    "durationFrames": 315,
    "words": [
      {
        "text": "Tanpa",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 9
      },
      {
        "text": "minyak",
        "startSec": 0.225,
        "startFrame": 7,
        "endFrame": 20
      },
      {
        "text": "mesin",
        "startSec": 0.971,
        "startFrame": 29,
        "endFrame": 37
      },
      {
        "text": "perang",
        "startSec": 1.233,
        "startFrame": 37,
        "endFrame": 43
      },
      {
        "text": "Jepang",
        "startSec": 1.435,
        "startFrame": 43,
        "endFrame": 52
      },
      {
        "text": "bisa",
        "startSec": 1.737,
        "startFrame": 52,
        "endFrame": 59
      },
      {
        "text": "mati",
        "startSec": 1.959,
        "startFrame": 59,
        "endFrame": 65
      },
      {
        "text": "total",
        "startSec": 2.181,
        "startFrame": 65,
        "endFrame": 78
      },
      {
        "text": "dalam",
        "startSec": 2.584,
        "startFrame": 78,
        "endFrame": 85
      },
      {
        "text": "satu",
        "startSec": 2.836,
        "startFrame": 85,
        "endFrame": 97
      },
      {
        "text": "sampai",
        "startSec": 3.229,
        "startFrame": 97,
        "endFrame": 108
      },
      {
        "text": "dua",
        "startSec": 3.602,
        "startFrame": 108,
        "endFrame": 116
      },
      {
        "text": "tahun",
        "startSec": 3.854,
        "startFrame": 116,
        "endFrame": 125
      },
      {
        "text": "doang",
        "startSec": 4.156,
        "startFrame": 125,
        "endFrame": 139
      },
      {
        "text": "Pilihannya",
        "startSec": 4.702,
        "startFrame": 141,
        "endFrame": 157
      },
      {
        "text": "cuma",
        "startSec": 5.166,
        "startFrame": 155,
        "endFrame": 162
      },
      {
        "text": "mundur",
        "startSec": 5.4,
        "startFrame": 162,
        "endFrame": 176
      },
      {
        "text": "atau",
        "startSec": 6.173,
        "startFrame": 185,
        "endFrame": 193
      },
      {
        "text": "sekalian",
        "startSec": 6.427,
        "startFrame": 193,
        "endFrame": 205
      },
      {
        "text": "bikin",
        "startSec": 6.833,
        "startFrame": 205,
        "endFrame": 214
      },
      {
        "text": "lumpuh",
        "startSec": 7.128,
        "startFrame": 214,
        "endFrame": 225
      },
      {
        "text": "armada",
        "startSec": 7.484,
        "startFrame": 225,
        "endFrame": 235
      },
      {
        "text": "Pasifik",
        "startSec": 7.839,
        "startFrame": 235,
        "endFrame": 248
      },
      {
        "text": "Amerika",
        "startSec": 8.256,
        "startFrame": 248,
        "endFrame": 266
      },
      {
        "text": "dalam",
        "startSec": 8.866,
        "startFrame": 266,
        "endFrame": 275
      },
      {
        "text": "satu",
        "startSec": 9.16,
        "startFrame": 275,
        "endFrame": 283
      },
      {
        "text": "pukulan",
        "startSec": 9.425,
        "startFrame": 283,
        "endFrame": 296
      },
      {
        "text": "dadakan",
        "startSec": 9.851,
        "startFrame": 296,
        "endFrame": 313
      }
    ]
  },
  "vo-scene4": {
    "id": "vo-scene4",
    "durationSec": 9.77,
    "durationFrames": 294,
    "words": [
      {
        "text": "Tanggal",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 12
      },
      {
        "text": "dua",
        "startSec": 0.33,
        "startFrame": 10,
        "endFrame": 15
      },
      {
        "text": "puluh",
        "startSec": 0.492,
        "startFrame": 15,
        "endFrame": 20
      },
      {
        "text": "enam",
        "startSec": 0.683,
        "startFrame": 20,
        "endFrame": 27
      },
      {
        "text": "November",
        "startSec": 0.905,
        "startFrame": 27,
        "endFrame": 43
      },
      {
        "text": "enam",
        "startSec": 1.721,
        "startFrame": 52,
        "endFrame": 60
      },
      {
        "text": "kapal",
        "startSec": 1.983,
        "startFrame": 60,
        "endFrame": 68
      },
      {
        "text": "induk",
        "startSec": 2.256,
        "startFrame": 68,
        "endFrame": 77
      },
      {
        "text": "Jepang",
        "startSec": 2.568,
        "startFrame": 77,
        "endFrame": 86
      },
      {
        "text": "berangkat",
        "startSec": 2.86,
        "startFrame": 86,
        "endFrame": 97
      },
      {
        "text": "diam-diam",
        "startSec": 3.244,
        "startFrame": 97,
        "endFrame": 111
      },
      {
        "text": "lewat",
        "startSec": 3.707,
        "startFrame": 111,
        "endFrame": 119
      },
      {
        "text": "jalur",
        "startSec": 3.959,
        "startFrame": 119,
        "endFrame": 127
      },
      {
        "text": "utara",
        "startSec": 4.242,
        "startFrame": 127,
        "endFrame": 139
      },
      {
        "text": "yang",
        "startSec": 4.645,
        "startFrame": 139,
        "endFrame": 144
      },
      {
        "text": "sepi",
        "startSec": 4.796,
        "startFrame": 144,
        "endFrame": 157
      },
      {
        "text": "Aturannya",
        "startSec": 5.341,
        "startFrame": 160,
        "endFrame": 176
      },
      {
        "text": "ketat",
        "startSec": 5.812,
        "startFrame": 174,
        "endFrame": 183
      },
      {
        "text": "banget",
        "startSec": 6.097,
        "startFrame": 183,
        "endFrame": 194
      },
      {
        "text": "semua",
        "startSec": 6.757,
        "startFrame": 203,
        "endFrame": 213
      },
      {
        "text": "sinyal",
        "startSec": 7.113,
        "startFrame": 213,
        "endFrame": 222
      },
      {
        "text": "radio",
        "startSec": 7.408,
        "startFrame": 222,
        "endFrame": 233
      },
      {
        "text": "dimatiin",
        "startSec": 7.774,
        "startFrame": 233,
        "endFrame": 246
      },
      {
        "text": "total",
        "startSec": 8.211,
        "startFrame": 246,
        "endFrame": 257
      },
      {
        "text": "biar",
        "startSec": 8.576,
        "startFrame": 257,
        "endFrame": 267
      },
      {
        "text": "nggak",
        "startSec": 8.891,
        "startFrame": 267,
        "endFrame": 272
      },
      {
        "text": "ketahuan",
        "startSec": 9.074,
        "startFrame": 272,
        "endFrame": 292
      }
    ]
  },
  "vo-scene5": {
    "id": "vo-scene5",
    "durationSec": 10.998,
    "durationFrames": 330,
    "words": [
      {
        "text": "Amerika",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 14
      },
      {
        "text": "pede",
        "startSec": 0.403,
        "startFrame": 12,
        "endFrame": 21
      },
      {
        "text": "pelabuhan",
        "startSec": 0.715,
        "startFrame": 21,
        "endFrame": 35
      },
      {
        "text": "Pearl",
        "startSec": 1.169,
        "startFrame": 35,
        "endFrame": 41
      },
      {
        "text": "Harbor",
        "startSec": 1.371,
        "startFrame": 41,
        "endFrame": 50
      },
      {
        "text": "aman",
        "startSec": 1.683,
        "startFrame": 50,
        "endFrame": 61
      },
      {
        "text": "dari",
        "startSec": 2.026,
        "startFrame": 61,
        "endFrame": 66
      },
      {
        "text": "torpedo",
        "startSec": 2.207,
        "startFrame": 66,
        "endFrame": 87
      },
      {
        "text": "soalnya",
        "startSec": 3.155,
        "startFrame": 95,
        "endFrame": 109
      },
      {
        "text": "airnya",
        "startSec": 3.619,
        "startFrame": 109,
        "endFrame": 119
      },
      {
        "text": "cuma",
        "startSec": 3.971,
        "startFrame": 119,
        "endFrame": 129
      },
      {
        "text": "sedalam",
        "startSec": 4.314,
        "startFrame": 129,
        "endFrame": 141
      },
      {
        "text": "dua",
        "startSec": 4.697,
        "startFrame": 141,
        "endFrame": 148
      },
      {
        "text": "belas",
        "startSec": 4.919,
        "startFrame": 148,
        "endFrame": 155
      },
      {
        "text": "meter",
        "startSec": 5.171,
        "startFrame": 155,
        "endFrame": 168
      },
      {
        "text": "Tapi",
        "startSec": 5.707,
        "startFrame": 171,
        "endFrame": 181
      },
      {
        "text": "diam-diam",
        "startSec": 5.989,
        "startFrame": 180,
        "endFrame": 193
      },
      {
        "text": "Jepang",
        "startSec": 6.433,
        "startFrame": 193,
        "endFrame": 202
      },
      {
        "text": "masang",
        "startSec": 6.735,
        "startFrame": 202,
        "endFrame": 210
      },
      {
        "text": "sirip",
        "startSec": 6.987,
        "startFrame": 210,
        "endFrame": 218
      },
      {
        "text": "kayu",
        "startSec": 7.259,
        "startFrame": 218,
        "endFrame": 228
      },
      {
        "text": "di",
        "startSec": 7.592,
        "startFrame": 228,
        "endFrame": 231
      },
      {
        "text": "ekor",
        "startSec": 7.693,
        "startFrame": 231,
        "endFrame": 239
      },
      {
        "text": "torpedonya",
        "startSec": 7.975,
        "startFrame": 239,
        "endFrame": 261
      },
      {
        "text": "biar",
        "startSec": 9.003,
        "startFrame": 270,
        "endFrame": 277
      },
      {
        "text": "nggak",
        "startSec": 9.235,
        "startFrame": 277,
        "endFrame": 283
      },
      {
        "text": "nyangkut",
        "startSec": 9.437,
        "startFrame": 283,
        "endFrame": 295
      },
      {
        "text": "di",
        "startSec": 9.82,
        "startFrame": 295,
        "endFrame": 297
      },
      {
        "text": "lumpur",
        "startSec": 9.9,
        "startFrame": 297,
        "endFrame": 307
      },
      {
        "text": "dasar",
        "startSec": 10.233,
        "startFrame": 307,
        "endFrame": 318
      },
      {
        "text": "laut",
        "startSec": 10.586,
        "startFrame": 318,
        "endFrame": 328
      }
    ]
  },
  "vo-scene6": {
    "id": "vo-scene6",
    "durationSec": 9.77,
    "durationFrames": 294,
    "words": [
      {
        "text": "Minggu",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 12
      },
      {
        "text": "pagi",
        "startSec": 0.325,
        "startFrame": 10,
        "endFrame": 18
      },
      {
        "text": "jam",
        "startSec": 0.597,
        "startFrame": 18,
        "endFrame": 23
      },
      {
        "text": "tujuh",
        "startSec": 0.779,
        "startFrame": 23,
        "endFrame": 35
      },
      {
        "text": "lewat",
        "startSec": 1.182,
        "startFrame": 35,
        "endFrame": 44
      },
      {
        "text": "lima",
        "startSec": 1.474,
        "startFrame": 44,
        "endFrame": 52
      },
      {
        "text": "puluh",
        "startSec": 1.726,
        "startFrame": 52,
        "endFrame": 57
      },
      {
        "text": "lima",
        "startSec": 1.908,
        "startFrame": 57,
        "endFrame": 69
      },
      {
        "text": "langit",
        "startSec": 2.603,
        "startFrame": 78,
        "endFrame": 86
      },
      {
        "text": "Hawaii",
        "startSec": 2.875,
        "startFrame": 86,
        "endFrame": 94
      },
      {
        "text": "langsung",
        "startSec": 3.138,
        "startFrame": 94,
        "endFrame": 107
      },
      {
        "text": "digelapin",
        "startSec": 3.551,
        "startFrame": 107,
        "endFrame": 120
      },
      {
        "text": "ratusan",
        "startSec": 3.984,
        "startFrame": 120,
        "endFrame": 133
      },
      {
        "text": "pesawat",
        "startSec": 4.438,
        "startFrame": 133,
        "endFrame": 145
      },
      {
        "text": "Jepang",
        "startSec": 4.831,
        "startFrame": 145,
        "endFrame": 159
      },
      {
        "text": "Kode",
        "startSec": 5.384,
        "startFrame": 162,
        "endFrame": 172
      },
      {
        "text": "serangannya",
        "startSec": 5.646,
        "startFrame": 169,
        "endFrame": 185
      },
      {
        "text": "udah",
        "startSec": 6.172,
        "startFrame": 185,
        "endFrame": 197
      },
      {
        "text": "melegenda",
        "startSec": 6.556,
        "startFrame": 197,
        "endFrame": 218
      },
      {
        "text": "Tora",
        "startSec": 7.587,
        "startFrame": 228,
        "endFrame": 244
      },
      {
        "text": "Tora",
        "startSec": 8.376,
        "startFrame": 251,
        "endFrame": 269
      },
      {
        "text": "Tora",
        "startSec": 9.188,
        "startFrame": 276,
        "endFrame": 292
      }
    ]
  },
  "vo-scene7": {
    "id": "vo-scene7",
    "durationSec": 9.587,
    "durationFrames": 288,
    "words": [
      {
        "text": "Deretan",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 15
      },
      {
        "text": "kapal",
        "startSec": 0.419,
        "startFrame": 13,
        "endFrame": 20
      },
      {
        "text": "perang",
        "startSec": 0.681,
        "startFrame": 20,
        "endFrame": 28
      },
      {
        "text": "yang",
        "startSec": 0.933,
        "startFrame": 28,
        "endFrame": 31
      },
      {
        "text": "lagi",
        "startSec": 1.044,
        "startFrame": 31,
        "endFrame": 37
      },
      {
        "text": "parkir",
        "startSec": 1.246,
        "startFrame": 37,
        "endFrame": 49
      },
      {
        "text": "rapi",
        "startSec": 1.629,
        "startFrame": 49,
        "endFrame": 57
      },
      {
        "text": "langsung",
        "startSec": 1.911,
        "startFrame": 57,
        "endFrame": 74
      },
      {
        "text": "jadi",
        "startSec": 2.475,
        "startFrame": 74,
        "endFrame": 84
      },
      {
        "text": "sasaran",
        "startSec": 2.788,
        "startFrame": 84,
        "endFrame": 98
      },
      {
        "text": "empuk",
        "startSec": 3.262,
        "startFrame": 98,
        "endFrame": 109
      },
      {
        "text": "Cuma",
        "startSec": 3.735,
        "startFrame": 112,
        "endFrame": 122
      },
      {
        "text": "dalam",
        "startSec": 4.004,
        "startFrame": 120,
        "endFrame": 127
      },
      {
        "text": "hitungan",
        "startSec": 4.219,
        "startFrame": 127,
        "endFrame": 137
      },
      {
        "text": "menit",
        "startSec": 4.568,
        "startFrame": 137,
        "endFrame": 147
      },
      {
        "text": "kapal",
        "startSec": 5.203,
        "startFrame": 156,
        "endFrame": 167
      },
      {
        "text": "perang",
        "startSec": 5.561,
        "startFrame": 167,
        "endFrame": 174
      },
      {
        "text": "Arizona",
        "startSec": 5.787,
        "startFrame": 174,
        "endFrame": 187
      },
      {
        "text": "meledak",
        "startSec": 6.248,
        "startFrame": 187,
        "endFrame": 200
      },
      {
        "text": "dan",
        "startSec": 6.658,
        "startFrame": 200,
        "endFrame": 204
      },
      {
        "text": "tenggelam",
        "startSec": 6.801,
        "startFrame": 204,
        "endFrame": 214
      },
      {
        "text": "bareng",
        "startSec": 7.119,
        "startFrame": 214,
        "endFrame": 222
      },
      {
        "text": "seribu",
        "startSec": 7.385,
        "startFrame": 222,
        "endFrame": 231
      },
      {
        "text": "seratus",
        "startSec": 7.693,
        "startFrame": 231,
        "endFrame": 242
      },
      {
        "text": "tujuh",
        "startSec": 8.072,
        "startFrame": 242,
        "endFrame": 251
      },
      {
        "text": "puluh",
        "startSec": 8.379,
        "startFrame": 251,
        "endFrame": 258
      },
      {
        "text": "tujuh",
        "startSec": 8.594,
        "startFrame": 258,
        "endFrame": 268
      },
      {
        "text": "awaknya",
        "startSec": 8.943,
        "startFrame": 268,
        "endFrame": 287
      }
    ]
  },
  "vo-scene8": {
    "id": "vo-scene8",
    "durationSec": 10.214,
    "durationFrames": 307,
    "words": [
      {
        "text": "Tapi",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 10
      },
      {
        "text": "serangan",
        "startSec": 0.271,
        "startFrame": 8,
        "endFrame": 18
      },
      {
        "text": "ini",
        "startSec": 0.609,
        "startFrame": 18,
        "endFrame": 27
      },
      {
        "text": "ternyata",
        "startSec": 0.896,
        "startFrame": 27,
        "endFrame": 39
      },
      {
        "text": "punya",
        "startSec": 1.305,
        "startFrame": 39,
        "endFrame": 49
      },
      {
        "text": "satu",
        "startSec": 1.633,
        "startFrame": 49,
        "endFrame": 62
      },
      {
        "text": "celah",
        "startSec": 2.074,
        "startFrame": 62,
        "endFrame": 71
      },
      {
        "text": "fatal",
        "startSec": 2.381,
        "startFrame": 71,
        "endFrame": 86
      },
      {
        "text": "Tiga",
        "startSec": 2.987,
        "startFrame": 90,
        "endFrame": 98
      },
      {
        "text": "kapal",
        "startSec": 3.211,
        "startFrame": 96,
        "endFrame": 105
      },
      {
        "text": "induk",
        "startSec": 3.491,
        "startFrame": 105,
        "endFrame": 114
      },
      {
        "text": "utama",
        "startSec": 3.801,
        "startFrame": 114,
        "endFrame": 123
      },
      {
        "text": "Amerika",
        "startSec": 4.101,
        "startFrame": 123,
        "endFrame": 136
      },
      {
        "text": "kebetulan",
        "startSec": 4.541,
        "startFrame": 136,
        "endFrame": 150
      },
      {
        "text": "lagi",
        "startSec": 4.991,
        "startFrame": 150,
        "endFrame": 159
      },
      {
        "text": "nggak",
        "startSec": 5.291,
        "startFrame": 159,
        "endFrame": 167
      },
      {
        "text": "di",
        "startSec": 5.551,
        "startFrame": 167,
        "endFrame": 169
      },
      {
        "text": "pelabuhan",
        "startSec": 5.641,
        "startFrame": 169,
        "endFrame": 187
      },
      {
        "text": "ditambah",
        "startSec": 6.531,
        "startFrame": 196,
        "endFrame": 207
      },
      {
        "text": "tangki",
        "startSec": 6.901,
        "startFrame": 207,
        "endFrame": 215
      },
      {
        "text": "minyak",
        "startSec": 7.151,
        "startFrame": 215,
        "endFrame": 225
      },
      {
        "text": "dan",
        "startSec": 7.511,
        "startFrame": 225,
        "endFrame": 229
      },
      {
        "text": "galangan",
        "startSec": 7.631,
        "startFrame": 229,
        "endFrame": 239
      },
      {
        "text": "perbaikannya",
        "startSec": 7.961,
        "startFrame": 239,
        "endFrame": 255
      },
      {
        "text": "malah",
        "startSec": 8.511,
        "startFrame": 255,
        "endFrame": 264
      },
      {
        "text": "lolos",
        "startSec": 8.811,
        "startFrame": 264,
        "endFrame": 277
      },
      {
        "text": "nggak",
        "startSec": 9.231,
        "startFrame": 277,
        "endFrame": 284
      },
      {
        "text": "dihancurin",
        "startSec": 9.461,
        "startFrame": 284,
        "endFrame": 305
      }
    ]
  },
  "vo-scene9": {
    "id": "vo-scene9",
    "durationSec": 10.318,
    "durationFrames": 310,
    "words": [
      {
        "text": "Besoknya",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 21
      },
      {
        "text": "delapan",
        "startSec": 0.923,
        "startFrame": 28,
        "endFrame": 40
      },
      {
        "text": "Desember",
        "startSec": 1.33,
        "startFrame": 40,
        "endFrame": 51
      },
      {
        "text": "seribu",
        "startSec": 1.716,
        "startFrame": 51,
        "endFrame": 62
      },
      {
        "text": "sembilan",
        "startSec": 2.082,
        "startFrame": 62,
        "endFrame": 71
      },
      {
        "text": "ratus",
        "startSec": 2.377,
        "startFrame": 71,
        "endFrame": 80
      },
      {
        "text": "empat",
        "startSec": 2.671,
        "startFrame": 80,
        "endFrame": 91
      },
      {
        "text": "puluh",
        "startSec": 3.017,
        "startFrame": 91,
        "endFrame": 96
      },
      {
        "text": "satu",
        "startSec": 3.19,
        "startFrame": 96,
        "endFrame": 109
      },
      {
        "text": "Amerika",
        "startSec": 3.932,
        "startFrame": 118,
        "endFrame": 130
      },
      {
        "text": "resmi",
        "startSec": 4.338,
        "startFrame": 130,
        "endFrame": 141
      },
      {
        "text": "mutusin",
        "startSec": 4.684,
        "startFrame": 141,
        "endFrame": 155
      },
      {
        "text": "perang",
        "startSec": 5.182,
        "startFrame": 155,
        "endFrame": 169
      },
      {
        "text": "Niat",
        "startSec": 5.71,
        "startFrame": 171,
        "endFrame": 180
      },
      {
        "text": "awal",
        "startSec": 5.939,
        "startFrame": 178,
        "endFrame": 187
      },
      {
        "text": "Jepang",
        "startSec": 6.236,
        "startFrame": 187,
        "endFrame": 197
      },
      {
        "text": "bikin",
        "startSec": 6.554,
        "startFrame": 197,
        "endFrame": 206
      },
      {
        "text": "Amerika",
        "startSec": 6.851,
        "startFrame": 206,
        "endFrame": 217
      },
      {
        "text": "ciut",
        "startSec": 7.241,
        "startFrame": 217,
        "endFrame": 227
      },
      {
        "text": "dan",
        "startSec": 7.568,
        "startFrame": 227,
        "endFrame": 231
      },
      {
        "text": "mundur",
        "startSec": 7.712,
        "startFrame": 231,
        "endFrame": 245
      },
      {
        "text": "malah",
        "startSec": 8.439,
        "startFrame": 253,
        "endFrame": 261
      },
      {
        "text": "balik",
        "startSec": 8.685,
        "startFrame": 261,
        "endFrame": 271
      },
      {
        "text": "jadi",
        "startSec": 9.034,
        "startFrame": 271,
        "endFrame": 279
      },
      {
        "text": "bumerang",
        "startSec": 9.29,
        "startFrame": 279,
        "endFrame": 291
      },
      {
        "text": "terbesar",
        "startSec": 9.7,
        "startFrame": 291,
        "endFrame": 309
      }
    ]
  },
  "vo-scene10": {
    "id": "vo-scene10",
    "durationSec": 6.139,
    "durationFrames": 185,
    "words": [
      {
        "text": "Pearl",
        "startSec": 0.0,
        "startFrame": 0,
        "endFrame": 7
      },
      {
        "text": "Harbor",
        "startSec": 0.152,
        "startFrame": 5,
        "endFrame": 17
      },
      {
        "text": "justru",
        "startSec": 0.551,
        "startFrame": 17,
        "endFrame": 29
      },
      {
        "text": "ngebangunin",
        "startSec": 0.971,
        "startFrame": 29,
        "endFrame": 44
      },
      {
        "text": "raksasa",
        "startSec": 1.453,
        "startFrame": 44,
        "endFrame": 56
      },
      {
        "text": "industri",
        "startSec": 1.883,
        "startFrame": 56,
        "endFrame": 69
      },
      {
        "text": "Amerika",
        "startSec": 2.303,
        "startFrame": 69,
        "endFrame": 89
      },
      {
        "text": "yang",
        "startSec": 3.266,
        "startFrame": 98,
        "endFrame": 103
      },
      {
        "text": "akhirnya",
        "startSec": 3.42,
        "startFrame": 103,
        "endFrame": 116
      },
      {
        "text": "ngebalikkin",
        "startSec": 3.861,
        "startFrame": 116,
        "endFrame": 131
      },
      {
        "text": "seluruh",
        "startSec": 4.373,
        "startFrame": 131,
        "endFrame": 143
      },
      {
        "text": "arah",
        "startSec": 4.752,
        "startFrame": 143,
        "endFrame": 151
      },
      {
        "text": "Perang",
        "startSec": 5.018,
        "startFrame": 151,
        "endFrame": 158
      },
      {
        "text": "Dunia",
        "startSec": 5.264,
        "startFrame": 158,
        "endFrame": 167
      },
      {
        "text": "Kedua",
        "startSec": 5.582,
        "startFrame": 167,
        "endFrame": 183
      }
    ]
  }
} as const;
