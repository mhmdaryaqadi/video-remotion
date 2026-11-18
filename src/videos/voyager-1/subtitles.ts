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

export const VOYAGER_AUDIO_DATA: Record<string, SceneAudioData> = {
  "vo-scene1": {
    "id": "vo-scene1",
    "durationSec": 12.816,
    "durationFrames": 385,
    "words": [
      {
        "text": "Bayangin",
        "startSec": 0.098,
        "startFrame": 3,
        "endFrame": 16
      },
      {
        "text": "lu",
        "startSec": 0.545,
        "startFrame": 16,
        "endFrame": 19
      },
      {
        "text": "ngirim",
        "startSec": 0.648,
        "startFrame": 19,
        "endFrame": 26
      },
      {
        "text": "chat",
        "startSec": 0.866,
        "startFrame": 26,
        "endFrame": 30
      },
      {
        "text": "ke",
        "startSec": 1.015,
        "startFrame": 30,
        "endFrame": 32
      },
      {
        "text": "temen",
        "startSec": 1.073,
        "startFrame": 32,
        "endFrame": 44
      },
      {
        "text": "tapi",
        "startSec": 1.726,
        "startFrame": 52,
        "endFrame": 59
      },
      {
        "text": "balasannya",
        "startSec": 1.956,
        "startFrame": 59,
        "endFrame": 72
      },
      {
        "text": "baru",
        "startSec": 2.414,
        "startFrame": 72,
        "endFrame": 78
      },
      {
        "text": "nyampe",
        "startSec": 2.586,
        "startFrame": 78,
        "endFrame": 86
      },
      {
        "text": "dua",
        "startSec": 2.873,
        "startFrame": 86,
        "endFrame": 91
      },
      {
        "text": "hari",
        "startSec": 3.034,
        "startFrame": 91,
        "endFrame": 95
      },
      {
        "text": "kemudian",
        "startSec": 3.183,
        "startFrame": 95,
        "endFrame": 113
      },
      {
        "text": "Itu",
        "startSec": 4.543,
        "startFrame": 136,
        "endFrame": 143
      },
      {
        "text": "yang",
        "startSec": 4.773,
        "startFrame": 143,
        "endFrame": 146
      },
      {
        "text": "kejadian",
        "startSec": 4.876,
        "startFrame": 146,
        "endFrame": 159
      },
      {
        "text": "tiap",
        "startSec": 5.312,
        "startFrame": 159,
        "endFrame": 165
      },
      {
        "text": "kali",
        "startSec": 5.495,
        "startFrame": 165,
        "endFrame": 170
      },
      {
        "text": "NASA",
        "startSec": 5.679,
        "startFrame": 170,
        "endFrame": 177
      },
      {
        "text": "ngobrol",
        "startSec": 5.897,
        "startFrame": 177,
        "endFrame": 188
      },
      {
        "text": "sama",
        "startSec": 6.252,
        "startFrame": 188,
        "endFrame": 194
      },
      {
        "text": "Voyager",
        "startSec": 6.481,
        "startFrame": 194,
        "endFrame": 204
      },
      {
        "text": "1",
        "startSec": 6.814,
        "startFrame": 204,
        "endFrame": 219
      },
      {
        "text": "Benda",
        "startSec": 8.085,
        "startFrame": 243,
        "endFrame": 250
      },
      {
        "text": "buatan",
        "startSec": 8.349,
        "startFrame": 250,
        "endFrame": 259
      },
      {
        "text": "manusia",
        "startSec": 8.624,
        "startFrame": 259,
        "endFrame": 269
      },
      {
        "text": "paling",
        "startSec": 8.968,
        "startFrame": 269,
        "endFrame": 276
      },
      {
        "text": "jauh",
        "startSec": 9.197,
        "startFrame": 276,
        "endFrame": 289
      },
      {
        "text": "lebih",
        "startSec": 9.874,
        "startFrame": 296,
        "endFrame": 302
      },
      {
        "text": "dari",
        "startSec": 10.069,
        "startFrame": 302,
        "endFrame": 307
      },
      {
        "text": "dua",
        "startSec": 10.241,
        "startFrame": 307,
        "endFrame": 312
      },
      {
        "text": "puluh",
        "startSec": 10.39,
        "startFrame": 312,
        "endFrame": 316
      },
      {
        "text": "empat",
        "startSec": 10.539,
        "startFrame": 316,
        "endFrame": 322
      },
      {
        "text": "miliar",
        "startSec": 10.745,
        "startFrame": 322,
        "endFrame": 331
      },
      {
        "text": "kilometer",
        "startSec": 11.021,
        "startFrame": 331,
        "endFrame": 343
      },
      {
        "text": "dari",
        "startSec": 11.445,
        "startFrame": 343,
        "endFrame": 349
      },
      {
        "text": "Bumi",
        "startSec": 11.628,
        "startFrame": 349,
        "endFrame": 361
      }
    ]
  },
  "vo-scene2": {
    "id": "vo-scene2",
    "durationSec": 18.672,
    "durationFrames": 561,
    "words": [
      {
        "text": "Caranya",
        "startSec": 0.099,
        "startFrame": 3,
        "endFrame": 14
      },
      {
        "text": "gimana",
        "startSec": 0.477,
        "startFrame": 14,
        "endFrame": 33
      },
      {
        "text": "NASA",
        "startSec": 1.848,
        "startFrame": 55,
        "endFrame": 64
      },
      {
        "text": "nggak",
        "startSec": 2.124,
        "startFrame": 64,
        "endFrame": 67
      },
      {
        "text": "pakai",
        "startSec": 2.25,
        "startFrame": 67,
        "endFrame": 74
      },
      {
        "text": "Wi-Fi",
        "startSec": 2.468,
        "startFrame": 74,
        "endFrame": 86
      },
      {
        "text": "atau",
        "startSec": 2.869,
        "startFrame": 86,
        "endFrame": 91
      },
      {
        "text": "satelit",
        "startSec": 3.041,
        "startFrame": 91,
        "endFrame": 101
      },
      {
        "text": "biasa",
        "startSec": 3.351,
        "startFrame": 101,
        "endFrame": 116
      },
      {
        "text": "Mereka",
        "startSec": 4.656,
        "startFrame": 140,
        "endFrame": 148
      },
      {
        "text": "pakai",
        "startSec": 4.92,
        "startFrame": 148,
        "endFrame": 154
      },
      {
        "text": "tiga",
        "startSec": 5.149,
        "startFrame": 154,
        "endFrame": 161
      },
      {
        "text": "antena",
        "startSec": 5.367,
        "startFrame": 161,
        "endFrame": 170
      },
      {
        "text": "parabola",
        "startSec": 5.654,
        "startFrame": 170,
        "endFrame": 180
      },
      {
        "text": "raksasa",
        "startSec": 6.009,
        "startFrame": 180,
        "endFrame": 193
      },
      {
        "text": "di",
        "startSec": 6.434,
        "startFrame": 193,
        "endFrame": 196
      },
      {
        "text": "Amerika",
        "startSec": 6.525,
        "startFrame": 196,
        "endFrame": 214
      },
      {
        "text": "Spanyol",
        "startSec": 7.385,
        "startFrame": 222,
        "endFrame": 240
      },
      {
        "text": "dan",
        "startSec": 8.211,
        "startFrame": 246,
        "endFrame": 254
      },
      {
        "text": "Australia",
        "startSec": 8.452,
        "startFrame": 254,
        "endFrame": 276
      },
      {
        "text": "Kenapa",
        "startSec": 9.957,
        "startFrame": 299,
        "endFrame": 310
      },
      {
        "text": "harus",
        "startSec": 10.324,
        "startFrame": 310,
        "endFrame": 317
      },
      {
        "text": "tiga",
        "startSec": 10.554,
        "startFrame": 317,
        "endFrame": 332
      },
      {
        "text": "Karena",
        "startSec": 11.826,
        "startFrame": 355,
        "endFrame": 365
      },
      {
        "text": "Bumi",
        "startSec": 12.159,
        "startFrame": 365,
        "endFrame": 371
      },
      {
        "text": "itu",
        "startSec": 12.366,
        "startFrame": 371,
        "endFrame": 376
      },
      {
        "text": "muter",
        "startSec": 12.537,
        "startFrame": 376,
        "endFrame": 390
      },
      {
        "text": "Jadi",
        "startSec": 13.752,
        "startFrame": 413,
        "endFrame": 423
      },
      {
        "text": "pas",
        "startSec": 14.085,
        "startFrame": 423,
        "endFrame": 427
      },
      {
        "text": "satu",
        "startSec": 14.245,
        "startFrame": 427,
        "endFrame": 433
      },
      {
        "text": "antena",
        "startSec": 14.44,
        "startFrame": 433,
        "endFrame": 441
      },
      {
        "text": "muter",
        "startSec": 14.704,
        "startFrame": 441,
        "endFrame": 447
      },
      {
        "text": "menjauh",
        "startSec": 14.899,
        "startFrame": 447,
        "endFrame": 464
      },
      {
        "text": "antena",
        "startSec": 15.725,
        "startFrame": 472,
        "endFrame": 482
      },
      {
        "text": "di",
        "startSec": 16.069,
        "startFrame": 482,
        "endFrame": 484
      },
      {
        "text": "sisi",
        "startSec": 16.149,
        "startFrame": 484,
        "endFrame": 492
      },
      {
        "text": "Bumi",
        "startSec": 16.39,
        "startFrame": 492,
        "endFrame": 497
      },
      {
        "text": "lain",
        "startSec": 16.562,
        "startFrame": 497,
        "endFrame": 504
      },
      {
        "text": "langsung",
        "startSec": 16.803,
        "startFrame": 504,
        "endFrame": 513
      },
      {
        "text": "gantian",
        "startSec": 17.112,
        "startFrame": 513,
        "endFrame": 523
      },
      {
        "text": "nangkap",
        "startSec": 17.422,
        "startFrame": 523,
        "endFrame": 537
      }
    ]
  },
  "vo-scene3": {
    "id": "vo-scene3",
    "durationSec": 13.104,
    "durationFrames": 394,
    "words": [
      {
        "text": "Sinyalnya",
        "startSec": 0.107,
        "startFrame": 3,
        "endFrame": 17
      },
      {
        "text": "melesat",
        "startSec": 0.555,
        "startFrame": 17,
        "endFrame": 27
      },
      {
        "text": "secepat",
        "startSec": 0.887,
        "startFrame": 27,
        "endFrame": 36
      },
      {
        "text": "cahaya",
        "startSec": 1.197,
        "startFrame": 36,
        "endFrame": 53
      },
      {
        "text": "tiga",
        "startSec": 2.045,
        "startFrame": 61,
        "endFrame": 68
      },
      {
        "text": "ratus",
        "startSec": 2.275,
        "startFrame": 68,
        "endFrame": 75
      },
      {
        "text": "ribu",
        "startSec": 2.516,
        "startFrame": 75,
        "endFrame": 82
      },
      {
        "text": "kilometer",
        "startSec": 2.722,
        "startFrame": 82,
        "endFrame": 94
      },
      {
        "text": "per",
        "startSec": 3.123,
        "startFrame": 94,
        "endFrame": 97
      },
      {
        "text": "detik",
        "startSec": 3.238,
        "startFrame": 97,
        "endFrame": 109
      },
      {
        "text": "Tapi",
        "startSec": 4.415,
        "startFrame": 132,
        "endFrame": 139
      },
      {
        "text": "saking",
        "startSec": 4.633,
        "startFrame": 139,
        "endFrame": 147
      },
      {
        "text": "jauhnya",
        "startSec": 4.908,
        "startFrame": 147,
        "endFrame": 165
      },
      {
        "text": "satu",
        "startSec": 5.757,
        "startFrame": 173,
        "endFrame": 180
      },
      {
        "text": "pesan",
        "startSec": 6.009,
        "startFrame": 180,
        "endFrame": 187
      },
      {
        "text": "aja",
        "startSec": 6.227,
        "startFrame": 187,
        "endFrame": 195
      },
      {
        "text": "butuh",
        "startSec": 6.491,
        "startFrame": 195,
        "endFrame": 201
      },
      {
        "text": "lebih",
        "startSec": 6.697,
        "startFrame": 201,
        "endFrame": 208
      },
      {
        "text": "dari",
        "startSec": 6.95,
        "startFrame": 208,
        "endFrame": 214
      },
      {
        "text": "dua",
        "startSec": 7.122,
        "startFrame": 214,
        "endFrame": 218
      },
      {
        "text": "puluh",
        "startSec": 7.271,
        "startFrame": 218,
        "endFrame": 223
      },
      {
        "text": "dua",
        "startSec": 7.443,
        "startFrame": 223,
        "endFrame": 228
      },
      {
        "text": "jam",
        "startSec": 7.615,
        "startFrame": 228,
        "endFrame": 234
      },
      {
        "text": "buat",
        "startSec": 7.798,
        "startFrame": 234,
        "endFrame": 238
      },
      {
        "text": "sampai",
        "startSec": 7.947,
        "startFrame": 238,
        "endFrame": 254
      },
      {
        "text": "Jadi",
        "startSec": 9.245,
        "startFrame": 277,
        "endFrame": 286
      },
      {
        "text": "nanya",
        "startSec": 9.532,
        "startFrame": 286,
        "endFrame": 293
      },
      {
        "text": "apa",
        "startSec": 9.761,
        "startFrame": 293,
        "endFrame": 297
      },
      {
        "text": "kabar",
        "startSec": 9.899,
        "startFrame": 297,
        "endFrame": 304
      },
      {
        "text": "hari",
        "startSec": 10.128,
        "startFrame": 304,
        "endFrame": 308
      },
      {
        "text": "ini",
        "startSec": 10.277,
        "startFrame": 308,
        "endFrame": 320
      },
      {
        "text": "jawabannya",
        "startSec": 10.931,
        "startFrame": 328,
        "endFrame": 344
      },
      {
        "text": "baru",
        "startSec": 11.481,
        "startFrame": 344,
        "endFrame": 350
      },
      {
        "text": "balik",
        "startSec": 11.653,
        "startFrame": 350,
        "endFrame": 356
      },
      {
        "text": "lusa",
        "startSec": 11.871,
        "startFrame": 356,
        "endFrame": 370
      }
    ]
  },
  "vo-scene4": {
    "id": "vo-scene4",
    "durationSec": 15.576,
    "durationFrames": 468,
    "words": [
      {
        "text": "Yang",
        "startSec": 0.098,
        "startFrame": 3,
        "endFrame": 9
      },
      {
        "text": "bikin",
        "startSec": 0.293,
        "startFrame": 9,
        "endFrame": 16
      },
      {
        "text": "geleng-geleng",
        "startSec": 0.534,
        "startFrame": 16,
        "endFrame": 35
      },
      {
        "text": "pemancar",
        "startSec": 1.417,
        "startFrame": 43,
        "endFrame": 54
      },
      {
        "text": "Voyager",
        "startSec": 1.784,
        "startFrame": 54,
        "endFrame": 66
      },
      {
        "text": "dayanya",
        "startSec": 2.185,
        "startFrame": 66,
        "endFrame": 77
      },
      {
        "text": "cuma",
        "startSec": 2.564,
        "startFrame": 77,
        "endFrame": 83
      },
      {
        "text": "sekitar",
        "startSec": 2.77,
        "startFrame": 83,
        "endFrame": 93
      },
      {
        "text": "dua",
        "startSec": 3.103,
        "startFrame": 93,
        "endFrame": 98
      },
      {
        "text": "puluh",
        "startSec": 3.252,
        "startFrame": 98,
        "endFrame": 103
      },
      {
        "text": "watt",
        "startSec": 3.435,
        "startFrame": 103,
        "endFrame": 114
      },
      {
        "text": "Sama",
        "startSec": 4.555,
        "startFrame": 137,
        "endFrame": 146
      },
      {
        "text": "kayak",
        "startSec": 4.853,
        "startFrame": 146,
        "endFrame": 152
      },
      {
        "text": "lampu",
        "startSec": 5.071,
        "startFrame": 152,
        "endFrame": 158
      },
      {
        "text": "kulkas",
        "startSec": 5.277,
        "startFrame": 158,
        "endFrame": 170
      },
      {
        "text": "di",
        "startSec": 5.656,
        "startFrame": 170,
        "endFrame": 172
      },
      {
        "text": "rumah",
        "startSec": 5.747,
        "startFrame": 172,
        "endFrame": 179
      },
      {
        "text": "lu",
        "startSec": 5.965,
        "startFrame": 179,
        "endFrame": 188
      },
      {
        "text": "Waktu",
        "startSec": 7.032,
        "startFrame": 211,
        "endFrame": 220
      },
      {
        "text": "nyampe",
        "startSec": 7.341,
        "startFrame": 220,
        "endFrame": 227
      },
      {
        "text": "Bumi",
        "startSec": 7.582,
        "startFrame": 227,
        "endFrame": 241
      },
      {
        "text": "sinyalnya",
        "startSec": 8.282,
        "startFrame": 248,
        "endFrame": 262
      },
      {
        "text": "udah",
        "startSec": 8.718,
        "startFrame": 262,
        "endFrame": 266
      },
      {
        "text": "super",
        "startSec": 8.878,
        "startFrame": 266,
        "endFrame": 273
      },
      {
        "text": "lemah",
        "startSec": 9.085,
        "startFrame": 273,
        "endFrame": 285
      },
      {
        "text": "Makanya",
        "startSec": 10.287,
        "startFrame": 309,
        "endFrame": 319
      },
      {
        "text": "datanya",
        "startSec": 10.631,
        "startFrame": 319,
        "endFrame": 329
      },
      {
        "text": "dikirim",
        "startSec": 10.952,
        "startFrame": 329,
        "endFrame": 337
      },
      {
        "text": "pelan-pelan",
        "startSec": 11.227,
        "startFrame": 337,
        "endFrame": 354
      },
      {
        "text": "ratusan",
        "startSec": 12.041,
        "startFrame": 361,
        "endFrame": 373
      },
      {
        "text": "bit",
        "startSec": 12.443,
        "startFrame": 373,
        "endFrame": 378
      },
      {
        "text": "per",
        "startSec": 12.615,
        "startFrame": 378,
        "endFrame": 381
      },
      {
        "text": "detik",
        "startSec": 12.706,
        "startFrame": 381,
        "endFrame": 388
      },
      {
        "text": "aja",
        "startSec": 12.924,
        "startFrame": 388,
        "endFrame": 402
      },
      {
        "text": "biar",
        "startSec": 13.624,
        "startFrame": 409,
        "endFrame": 415
      },
      {
        "text": "nggak",
        "startSec": 13.842,
        "startFrame": 415,
        "endFrame": 419
      },
      {
        "text": "rusak",
        "startSec": 13.979,
        "startFrame": 419,
        "endFrame": 427
      },
      {
        "text": "di",
        "startSec": 14.232,
        "startFrame": 427,
        "endFrame": 429
      },
      {
        "text": "jalan",
        "startSec": 14.312,
        "startFrame": 429,
        "endFrame": 444
      }
    ]
  },
  "vo-scene5": {
    "id": "vo-scene5",
    "durationSec": 6.312,
    "durationFrames": 190,
    "words": [
      {
        "text": "Dan",
        "startSec": 0.107,
        "startFrame": 3,
        "endFrame": 9
      },
      {
        "text": "gokilnya",
        "startSec": 0.302,
        "startFrame": 9,
        "endFrame": 28
      },
      {
        "text": "pesawat",
        "startSec": 1.208,
        "startFrame": 36,
        "endFrame": 46
      },
      {
        "text": "jadul",
        "startSec": 1.541,
        "startFrame": 46,
        "endFrame": 54
      },
      {
        "text": "tahun",
        "startSec": 1.793,
        "startFrame": 54,
        "endFrame": 60
      },
      {
        "text": "tujuh",
        "startSec": 2.011,
        "startFrame": 60,
        "endFrame": 67
      },
      {
        "text": "puluh",
        "startSec": 2.229,
        "startFrame": 67,
        "endFrame": 71
      },
      {
        "text": "tujuh",
        "startSec": 2.366,
        "startFrame": 71,
        "endFrame": 78
      },
      {
        "text": "ini",
        "startSec": 2.584,
        "startFrame": 78,
        "endFrame": 85
      },
      {
        "text": "masih",
        "startSec": 2.825,
        "startFrame": 85,
        "endFrame": 92
      },
      {
        "text": "setia",
        "startSec": 3.066,
        "startFrame": 92,
        "endFrame": 99
      },
      {
        "text": "ngirim",
        "startSec": 3.295,
        "startFrame": 99,
        "endFrame": 105
      },
      {
        "text": "kabar",
        "startSec": 3.49,
        "startFrame": 105,
        "endFrame": 114
      },
      {
        "text": "dari",
        "startSec": 3.8,
        "startFrame": 114,
        "endFrame": 119
      },
      {
        "text": "luar",
        "startSec": 3.972,
        "startFrame": 119,
        "endFrame": 125
      },
      {
        "text": "tata",
        "startSec": 4.155,
        "startFrame": 125,
        "endFrame": 131
      },
      {
        "text": "surya",
        "startSec": 4.35,
        "startFrame": 131,
        "endFrame": 140
      },
      {
        "text": "sampai",
        "startSec": 4.683,
        "startFrame": 140,
        "endFrame": 149
      },
      {
        "text": "sekarang",
        "startSec": 4.97,
        "startFrame": 149,
        "endFrame": 166
      }
    ]
  }
} as const;
