import { b } from './types'
import type { PracticeLesson } from './types'
import { expandedExamples, expandedSolutions } from './expandedExamples'

type Input = Omit<PracticeLesson, 'code' | 'solution' | 'activity'>
const lesson = (input: Input): PracticeLesson => ({
  ...input,
  code: expandedExamples[input.id],
  solution: expandedSolutions[input.id],
})

export const expandedLessons: PracticeLesson[] = [
  lesson({
    id: 'coordinates',
    module: 0,
    scene: 'box',
    minutes: 8,
    title: b('Baca arah dan satuan koordinat', 'Read directions and coordinate units'),
    description: b(
      'Bedakan piksel, persentase, kanan, dan atas sebelum menambah efek.',
      'Understand pixels, percentages, right, and up before adding effects.',
    ),
    concept: 'x · y · xPercent · yPercent',
    objective: b(
      'Memilih satuan perpindahan dan memprediksi arah elemen.',
      'Choose an offset unit and predict an element’s direction.',
    ),
    model: b(
      'Bayangkan kertas kotak-kotak. x positif menuju kanan dan y positif menuju bawah. Nilai negatif membalik arah itu. Elemen tetap punya tempat semula dalam layout.',
      'Imagine graph paper. Positive x goes right and positive y goes down. Negative values reverse those directions. The element keeps its original space in the layout.',
    ),
    explanation: b(
      'x: 100 berarti 100 piksel. xPercent: 100 berarti satu kali lebar elemen itu sendiri, bukan lebar layar. Begitu juga yPercent memakai tinggi elemen. Pada kotak selebar 56 piksel, xPercent: 200 berarti sekitar 112 piksel. Kombinasikan satuan hanya setelah kamu memahami sumber ukurannya.',
      'x: 100 means 100 pixels. xPercent: 100 means one width of the element itself, not the screen. yPercent similarly uses its height. For a 56-pixel box, xPercent: 200 is about 112 pixels. Combine units once you know what each is measured against.',
    ),
    steps: [
      b(
        'Jalankan, lalu perhatikan kotak menuju kanan dan sedikit ke atas.',
        'Run and notice the box moving right and slightly up.',
      ),
      b(
        'Ubah xPercent ke 200; perkirakan jaraknya sebelum menjalankan.',
        'Set xPercent to 200; estimate the distance before running.',
      ),
      b(
        'Ubah yPercent ke -100 untuk naik setinggi kotaknya sendiri.',
        'Set yPercent to -100 to move up by one box height.',
      ),
    ],
    mistake: b(
      'xPercent: 100 tidak berarti ujung kanan layar. Untuk persentase terhadap pembungkus, kamu perlu pengukuran atau layout yang berbeda.',
      'xPercent: 100 does not mean the right edge of the screen. A percentage of the container requires a different measurement or layout.',
    ),
    recap: [
      b('x dan y memakai piksel ketika nilainya angka.', 'Numeric x and y use pixels.'),
      b(
        'xPercent dan yPercent mengikuti ukuran target.',
        'xPercent and yPercent use the target’s size.',
      ),
    ],
    challenge: {
      title: b('Dua lebar ke kanan, satu tinggi ke atas', 'Two widths right, one height up'),
      task: b(
        'Gunakan xPercent: 200 dan yPercent: -100 pada .box.',
        'Use xPercent: 200 and yPercent: -100 on .box.',
      ),
      hints: [
        b(
          'Ubah properti di dalam gsap.to(), tanpa tanda %.',
          'Edit the properties inside gsap.to(), without a % sign.',
        ),
        b('Tulis 200 dan -100 sebagai angka.', 'Write 200 and -100 as numbers.'),
      ],
      rule: 'coordinates',
    },
  }),
  lesson({
    id: 'from-to',
    module: 1,
    scene: 'box',
    minutes: 10,
    title: b('Tentukan awal dan akhir dengan fromTo()', 'Specify both ends with fromTo()'),
    description: b(
      'Buat dua keadaan eksplisit dan lihat perbedaannya dari to() dan from().',
      'Define two explicit states and compare them with to() and from().',
    ),
    concept: 'gsap.fromTo()',
    objective: b(
      'Menulis keadaan awal dan tujuan dalam dua objek berbeda.',
      'Write the starting and destination states in separate objects.',
    ),
    model: b(
      'to() memberi tujuan; from() memberi asal. fromTo() memberi keduanya, seperti foto sebelum dan sesudah yang kamu tentukan sendiri.',
      'to() gives a destination; from() gives an origin. fromTo() gives both, like choosing your own before and after photos.',
    ),
    explanation: b(
      'Argumen pertama memilih target. Objek kedua menyimpan nilai awal. Objek ketiga menyimpan nilai tujuan sekaligus duration, ease, dan kontrol waktu. opacity: 0 berarti tidak terlihat, sedangkan 1 berarti terlihat penuh. Nilai awal fromTo() biasanya diterapkan saat tween dibuat; immediateRender mengatur perilaku awal ini pada rangkaian yang lebih kompleks.',
      'The first argument selects the target. The second object holds starting values. The third holds destination values plus duration, ease, and timing controls. opacity: 0 is invisible; 1 is fully visible. fromTo() usually applies starting values on creation; immediateRender controls that behavior in more complex sequences.',
    ),
    steps: [
      b(
        'Jalankan dan amati kotak memudar masuk sambil berpindah.',
        'Run and watch the box fade in while changing position.',
      ),
      b(
        'Ubah x pada objek awal menjadi -30 dan opacity menjadi 0.',
        'Set x in the starting object to -30 and opacity to 0.',
      ),
      b(
        'Ubah x pada objek tujuan menjadi 240. Bandingkan dua objeknya.',
        'Set destination x to 240. Compare the two objects.',
      ),
    ],
    mistake: b(
      'Meletakkan duration pada objek awal membuat maksud kode membingungkan. Kontrol waktu diletakkan pada objek tujuan.',
      'Putting duration in the starting object makes the code confusing. Timing controls belong in the destination object.',
    ),
    recap: [
      b(
        'Urutannya adalah target, keadaan awal, keadaan tujuan.',
        'The order is target, starting state, destination state.',
      ),
      b(
        'Gunakan saat kedua ujung animasi perlu pasti.',
        'Use it when both ends of the animation must be explicit.',
      ),
    ],
    challenge: {
      title: b('Muncul dari kiri', 'Enter from the left'),
      task: b(
        'Mulai dari x: -30 dan opacity: 0, lalu berakhir di x: 240 dan opacity: 1.',
        'Start at x: -30 and opacity: 0, then end at x: 240 and opacity: 1.',
      ),
      hints: [
        b(
          'Objek pertama setelah selector adalah keadaan awal.',
          'The first object after the selector is the start.',
        ),
        b(
          'Ubah dua nilai x di dua objek yang berbeda.',
          'Edit the two x values in their separate objects.',
        ),
      ],
      rule: 'from-to',
    },
  }),
  lesson({
    id: 'relative',
    module: 1,
    scene: 'box',
    minutes: 8,
    title: b('Tambahkan nilai relatif', 'Use relative values'),
    description: b(
      'Pahami arti += dan pengaruh repeat tanpa menebak.',
      'Understand += and repetition without guessing.',
    ),
    concept: 'relative values · +=',
    objective: b(
      'Membedakan tujuan absolut dan tambahan relatif.',
      'Distinguish absolute destinations from relative additions.',
    ),
    model: b(
      'x: 80 berarti menuju offset 80. x: "+=80" berarti tambah 80 dari keadaan yang dibaca saat tween mulai.',
      'x: 80 means go to offset 80. x: "+=80" means add 80 to the state read when the tween starts.',
    ),
    explanation: b(
      'Sintaks += harus berupa string dengan tanda kutip. Sintaks ini berguna untuk instruksi seperti putar 90 derajat lagi. repeat biasa memutar ulang titik awal dan akhir tween yang sama; ia tidak otomatis menambah jarak pada setiap putaran. repeatRefresh adalah konsep berbeda untuk menghitung ulang nilai pada pengulangan.',
      'The += syntax is a quoted string. It is useful for instructions such as rotate another 90 degrees. A normal repeat replays the same start and end states; it does not automatically accumulate distance. repeatRefresh is a separate feature for recalculating values on repeats.',
    ),
    steps: [
      b(
        'Jalankan dan amati kedua putaran memiliki titik akhir yang sama.',
        'Run and observe that both iterations share an endpoint.',
      ),
      b('Ubah x menjadi "+=120".', 'Set x to "+=120".'),
      b(
        'Ubah rotation ke "+=90" dan amati putarannya.',
        'Set rotation to "+=90" and watch the turn.',
      ),
    ],
    mistake: b(
      '+=80 tanpa tanda kutip bukan nilai JavaScript yang valid di objek ini.',
      'Unquoted +=80 is not a valid JavaScript value in this object.',
    ),
    recap: [
      b(
        'Nilai relatif dihitung dari keadaan awal tween.',
        'Relative values are measured from the tween’s starting state.',
      ),
      b('repeat biasa mengulang lintasan yang sama.', 'A normal repeat replays the same path.'),
    ],
    challenge: {
      title: b('Tambahan yang terukur', 'A measured addition'),
      task: b('Gunakan x: "+=120" dan rotation: "+=90".', 'Use x: "+=120" and rotation: "+=90".'),
      hints: [
        b('Pertahankan tanda kutip di kedua nilai.', 'Keep both values quoted.'),
        b('Ubah 80 menjadi 120 dan 45 menjadi 90.', 'Change 80 to 120 and 45 to 90.'),
      ],
      rule: 'relative',
    },
  }),
  lesson({
    id: 'origin',
    module: 1,
    scene: 'box',
    minutes: 7,
    title: b('Pindahkan titik tumpu rotasi', 'Move the rotation pivot'),
    description: b(
      'Ubah karakter rotasi lewat transformOrigin.',
      'Change the character of a rotation with transformOrigin.',
    ),
    concept: 'transformOrigin · rotation',
    objective: b(
      'Membuat elemen berputar dari sudut tertentu.',
      'Rotate an element around a chosen corner.',
    ),
    model: b(
      'Bayangkan engsel pintu. Pintu yang sama terasa berbeda ketika engselnya di tengah atau di sudut.',
      'Think of a door hinge. The same shape behaves differently with a hinge at its center or corner.',
    ),
    explanation: b(
      'transformOrigin memakai urutan horizontal lalu vertikal. "50% 50%" adalah tengah. "0% 100%" adalah kiri bawah. Properti ini mengubah pusat transform; posisi asli dalam layout tetap sama. rotation memakai derajat.',
      'transformOrigin uses horizontal then vertical coordinates. "50% 50%" is the center. "0% 100%" is bottom left. It changes the transform pivot while the original layout position stays the same. rotation uses degrees.',
    ),
    steps: [
      b('Jalankan dengan titik tumpu tengah.', 'Run with the center pivot.'),
      b('Ganti transformOrigin ke "0% 100%".', 'Set transformOrigin to "0% 100%".'),
      b(
        'Jeda di tengah untuk membandingkan bentuk lintasannya.',
        'Pause halfway to compare the path.',
      ),
    ],
    mistake: b(
      'Jangan menukar urutan horizontal dan vertikal. Coba "100% 0%" untuk melihat sudut sebaliknya.',
      'Do not swap horizontal and vertical positions. Try "100% 0%" to see the opposite corner.',
    ),
    recap: [
      b('Transform origin berfungsi sebagai titik tumpu.', 'Transform origin acts as the pivot.'),
      b(
        'Dua angka persentase mengikuti ukuran elemen.',
        'The two percentages use the element’s dimensions.',
      ),
    ],
    challenge: {
      title: b('Engsel kiri bawah', 'A bottom-left hinge'),
      task: b(
        'Putar kotak dengan transformOrigin: "0% 100%".',
        'Rotate the box with transformOrigin: "0% 100%".',
      ),
      hints: [
        b('Ubah string transformOrigin saja.', 'Change only the transformOrigin string.'),
        b('0% adalah kiri; 100% adalah bawah.', '0% is left; 100% is bottom.'),
      ],
      rule: 'origin',
    },
  }),
  lesson({
    id: 'auto-alpha',
    module: 1,
    scene: 'cards',
    minutes: 9,
    title: b('Munculkan kartu dengan autoAlpha', 'Reveal cards with autoAlpha'),
    description: b(
      'Kenali hubungan opacity dan visibility.',
      'Understand how opacity and visibility work together.',
    ),
    concept: 'autoAlpha · visibility',
    objective: b(
      'Membuat kartu masuk dari keadaan benar-benar tersembunyi.',
      'Reveal cards from a fully hidden state.',
    ),
    model: b(
      'Opacity seperti menurunkan volume visual. autoAlpha juga mengatur visibility ketika opacity mencapai nol.',
      'Opacity is like lowering visual volume. autoAlpha also manages visibility when opacity reaches zero.',
    ),
    explanation: b(
      'autoAlpha adalah kemudahan dari CSSPlugin GSAP. autoAlpha: 0 memasangkan opacity nol dan visibility hidden. Saat nilainya naik, visibility menjadi inherit. Ia tidak menghapus ruang layout. Dalam from(), nilai ini adalah keadaan awal sebelum menuju tampilan CSS semula.',
      'autoAlpha is a GSAP CSSPlugin convenience. autoAlpha: 0 combines zero opacity with hidden visibility. As it rises, visibility becomes inherit. It preserves layout space. In from(), this is the starting state before returning to the CSS appearance.',
    ),
    steps: [
      b(
        'Jalankan dan amati kartu masih agak terlihat pada awal animasi.',
        'Run and observe that the cards are partly visible at the start.',
      ),
      b('Ubah autoAlpha menjadi 0.', 'Set autoAlpha to 0.'),
      b(
        'Geser progres ke 0% lalu 50% untuk memeriksa transisinya.',
        'Scrub to 0% and then 50% to inspect the transition.',
      ),
    ],
    mistake: b(
      'autoAlpha: 0 tidak sama dengan display: none. Ruang kartu tetap tersedia agar layout tidak melompat.',
      'autoAlpha: 0 is not display: none. The cards retain their space so the layout does not jump.',
    ),
    recap: [
      b(
        'autoAlpha menggabungkan opacity dan visibility.',
        'autoAlpha combines opacity and visibility.',
      ),
      b(
        'from() memakai properti sebagai titik awal.',
        'from() uses the properties as its starting state.',
      ),
    ],
    challenge: {
      title: b('Mulai dari tersembunyi', 'Start hidden'),
      task: b(
        'Gunakan from() dengan autoAlpha: 0 pada ketiga .card.',
        'Use from() with autoAlpha: 0 on all three .card elements.',
      ),
      hints: [
        b('Pertahankan selector .card.', 'Keep the .card selector.'),
        b('Ganti 0.35 menjadi 0.', 'Change 0.35 to 0.'),
      ],
      rule: 'auto-alpha',
    },
  }),
  lesson({
    id: 'repeat-delay',
    module: 2,
    scene: 'box',
    minutes: 8,
    title: b('Beri napas di antara pengulangan', 'Leave space between repeats'),
    description: b(
      'Bedakan delay awal dan repeatDelay.',
      'Separate the initial delay from repeatDelay.',
    ),
    concept: 'repeatDelay · repeat · yoyo',
    objective: b(
      'Mengatur jeda antarputaran secara terpisah dari durasi tween.',
      'Set the gap between iterations independently from tween duration.',
    ),
    model: b(
      'Pikirkan pola tepuk, tunggu, tepuk. duration mengatur satu tepuk; repeatDelay mengatur waktu menunggu antarputaran.',
      'Think of clap, wait, clap. duration controls one clap; repeatDelay controls the wait between iterations.',
    ),
    explanation: b(
      'repeat: 2 menambahkan dua putaran setelah putaran pertama, sehingga totalnya tiga. repeatDelay tidak menambah waktu tunggu sebelum putaran pertama. Dengan yoyo, putaran berikutnya membalik arah. Gunakan jumlah terbatas selama belajar agar awal dan akhir tetap mudah diamati.',
      'repeat: 2 adds two iterations after the first, making three in total. repeatDelay does not delay the first iteration. With yoyo, the next iteration reverses direction. Use finite counts while learning so starts and ends remain easy to inspect.',
    ),
    steps: [
      b(
        'Jalankan dan perhatikan jeda kecil saat kotak akan kembali.',
        'Run and notice the small pause before the box returns.',
      ),
      b('Ubah repeatDelay ke 0.8.', 'Set repeatDelay to 0.8.'),
      b(
        'Ubah repeat menjadi 2, lalu hitung tiga putaran.',
        'Set repeat to 2, then count three iterations.',
      ),
    ],
    mistake: b(
      'repeat menghitung tambahan putaran. Nilai 2 berarti tiga kali pemutaran total.',
      'repeat counts extra iterations. A value of 2 means three plays in total.',
    ),
    recap: [
      b(
        'delay berlaku sebelum mulai; repeatDelay antarputaran.',
        'delay comes before playback; repeatDelay comes between iterations.',
      ),
      b(
        'yoyo tidak menambah jumlah repeat secara otomatis.',
        'yoyo does not automatically add repeat iterations.',
      ),
    ],
    challenge: {
      title: b('Tiga putaran dengan jeda', 'Three iterations with a pause'),
      task: b(
        'Gunakan repeat: 2 dan repeatDelay: 0.8 atau lebih.',
        'Use repeat: 2 and repeatDelay: 0.8 or more.',
      ),
      hints: [
        b('Ada dua nilai yang harus diubah.', 'Two values need to change.'),
        b(
          'Pertahankan yoyo: true agar arah bergantian.',
          'Keep yoyo: true to alternate direction.',
        ),
      ],
      rule: 'repeat-delay',
    },
  }),
  lesson({
    id: 'keyframes',
    module: 2,
    scene: 'box',
    minutes: 12,
    title: b('Buat beberapa pose dengan keyframes', 'Create poses with keyframes'),
    description: b(
      'Susun perubahan berurutan pada satu target.',
      'Sequence changes on a single target.',
    ),
    concept: 'keyframes · array',
    objective: b('Menambahkan satu pose ke array keyframes.', 'Add a pose to a keyframes array.'),
    model: b(
      'Bayangkan komik dengan beberapa panel. Setiap objek dalam array adalah satu tujuan; GSAP menghubungkan panel-panel itu.',
      'Imagine several comic panels. Each object in the array is a destination; GSAP connects those panels.',
    ),
    explanation: b(
      'Tanda [] membungkus daftar. Setiap objek {} di dalamnya menyimpan properti dan durasi satu langkah. Dalam bentuk array ini, langkah berjalan berurutan. Properti yang tidak ditulis pada langkah berikutnya mempertahankan nilainya. Keyframes cocok untuk satu target; timeline lebih fleksibel untuk banyak target.',
      'Square brackets hold a list. Each object inside stores properties and a duration for one step. This array form plays sequentially. Properties omitted from later steps keep their value. Keyframes suit one target; timelines are more flexible across multiple targets.',
    ),
    steps: [
      b('Jalankan dan amati kanan, atas, lalu kembali.', 'Run and observe right, up, then return.'),
      b(
        'Temukan koma yang memisahkan ketiga objek.',
        'Find the commas separating the three objects.',
      ),
      b(
        'Tambahkan objek keempat: rotation: 90 dan duration: 0.5.',
        'Add a fourth object: rotation: 90 and duration: 0.5.',
      ),
    ],
    mistake: b(
      'Objek baru di dalam array perlu dipisahkan koma. Jika sintaks gagal, periksa batas antara dua objek.',
      'A new array object needs a separating comma. If syntax fails, inspect the boundary between objects.',
    ),
    recap: [
      b(
        'Array keyframes berisi tujuan berurutan.',
        'A keyframes array holds sequential destinations.',
      ),
      b('Setiap langkah dapat punya duration sendiri.', 'Each step can have its own duration.'),
    ],
    challenge: {
      title: b('Tambahkan pose keempat', 'Add a fourth pose'),
      task: b(
        'Buat minimal empat keyframe dan akhiri dengan rotation: 90.',
        'Create at least four keyframes and finish with rotation: 90.',
      ),
      hints: [
        b('Tambahkan koma setelah objek ketiga.', 'Add a comma after the third object.'),
        b(
          'Tambahkan { rotation: 90, duration: 0.5 } sebelum ].',
          'Add { rotation: 90, duration: 0.5 } before ].',
        ),
      ],
      rule: 'keyframes',
    },
  }),
  lesson({
    id: 'defaults',
    module: 3,
    scene: 'timeline',
    minutes: 9,
    title: b('Atur nilai bersama dengan defaults', 'Share values with defaults'),
    description: b(
      'Kurangi pengulangan tanpa menghilangkan kendali tiap tween.',
      'Reduce repetition while retaining control of each tween.',
    ),
    concept: 'timeline defaults',
    objective: b(
      'Mengubah durasi beberapa tween lewat satu nilai bersama.',
      'Change several tween durations through one shared value.',
    ),
    model: b(
      'defaults seperti aturan awal sebuah resep. Semua langkah mengikuti aturan itu, kecuali langkah yang punya instruksi sendiri.',
      'defaults is like a recipe’s baseline instruction. Every step follows it unless it specifies its own value.',
    ),
    explanation: b(
      'defaults pada gsap.timeline() diwariskan ke tween anak saat dibuat. Kamu tetap dapat menulis duration pada satu tween untuk mengganti nilai bersama. Ini berbeda dari gsap.defaults(), yang cakupannya global. Untuk latihan kecil, batasi pengaturan pada timeline agar efeknya mudah dilacak.',
      'Timeline defaults are inherited by child tweens when they are created. A duration on an individual tween overrides the shared value. This differs from the global gsap.defaults(). Keep settings on the timeline here so their scope stays easy to follow.',
    ),
    steps: [
      b(
        'Amati bahwa tiga .to() tidak menuliskan duration.',
        'Notice that the three .to() calls omit duration.',
      ),
      b('Ubah konstanta duration menjadi 1.5.', 'Set the duration constant to 1.5.'),
      b(
        'Jalankan dan bandingkan panjang ketiga track.',
        'Run and compare the three track lengths.',
      ),
    ],
    mistake: b(
      'duration pada tween anak mengalahkan defaults. Periksa objek anak jika satu track berbeda.',
      'A child tween’s duration overrides defaults. Check that object if one track differs.',
    ),
    recap: [
      b('Timeline defaults berlaku pada tween anak.', 'Timeline defaults apply to child tweens.'),
      b(
        'Nilai per tween tetap dapat mengganti defaults.',
        'Individual tween values can override defaults.',
      ),
    ],
    challenge: {
      title: b('Satu perubahan untuk tiga tween', 'One edit for three tweens'),
      task: b(
        'Buat ketiga tween berdurasi minimal 1.5 detik lewat defaults.',
        'Give all three tweens durations of at least 1.5 seconds through defaults.',
      ),
      hints: [
        b('Ubah konstanta duration di atas.', 'Edit the duration constant at the top.'),
        b(
          'Pastikan tidak ada duration lain yang menimpa nilai bersama.',
          'Ensure no child duration overrides the shared value.',
        ),
      ],
      rule: 'defaults',
    },
  }),
  lesson({
    id: 'stagger-order',
    module: 3,
    scene: 'items',
    minutes: 10,
    title: b('Balik arah urutan stagger', 'Reverse the stagger order'),
    description: b(
      'Gunakan objek stagger untuk mengendalikan titik mulai.',
      'Use a stagger object to control where the sequence begins.',
    ),
    concept: 'stagger.each · stagger.from',
    objective: b(
      'Membuat kelompok mulai dari elemen terakhir.',
      'Start a group from its last element.',
    ),
    model: b(
      'Stagger menentukan siapa mendapat giliran dahulu. from di dalam objek stagger adalah urutan, sedangkan gsap.from() adalah metode tween.',
      'Stagger decides who gets the first turn. from inside the stagger object controls order, while gsap.from() is a tween method.',
    ),
    explanation: b(
      'each adalah selisih waktu awal antartarget. from: "end" membalik urutan. "center" memulai dari tengah. Untuk grid besar, GSAP juga mendukung grid dan axis, tetapi mulai dari tiga elemen agar hubungan urutan dan waktu mudah terlihat.',
      'each is the gap between target start times. from: "end" reverses the order; "center" begins in the middle. GSAP also supports grid and axis for larger layouts. Start with three elements so order and timing are easy to observe.',
    ),
    steps: [
      b(
        'Jalankan dan catat kotak mana yang muncul dahulu.',
        'Run and note which box appears first.',
      ),
      b('Ganti from pada objek stagger menjadi "end".', 'Set from in the stagger object to "end".'),
      b(
        'Naikkan each ke 0.2 agar urutan lebih mudah dibaca.',
        'Raise each to 0.2 to make the order clearer.',
      ),
    ],
    mistake: b(
      'from: "end" berada di dalam stagger, bukan sejajar dengan duration.',
      'from: "end" belongs inside stagger, not beside duration.',
    ),
    recap: [
      b('each menentukan selisih awal.', 'each controls the starting gap.'),
      b('from menentukan asal urutan kelompok.', 'from controls the group’s starting order.'),
    ],
    challenge: {
      title: b('Mulai dari ujung', 'Start at the end'),
      task: b(
        'Gunakan stagger { each: 0.2, from: "end" } atau each lebih besar.',
        'Use stagger { each: 0.2, from: "end" } or a larger each.',
      ),
      hints: [
        b('Ubah objek stagger saja.', 'Edit only the stagger object.'),
        b(
          'Pertahankan target .item agar tiga elemen ikut.',
          'Keep .item as the target so all three participate.',
        ),
      ],
      rule: 'stagger-order',
    },
  }),
  lesson({
    id: 'speed',
    module: 3,
    scene: 'timeline',
    minutes: 8,
    title: b('Ubah kecepatan dengan timeScale()', 'Change playback speed with timeScale()'),
    description: b(
      'Perlambat seluruh rangkaian tanpa mengubah isi tween.',
      'Slow an entire sequence without editing its tweens.',
    ),
    concept: 'timeScale()',
    objective: b(
      'Mengatur laju pemutaran seluruh timeline.',
      'Control the playback rate of a whole timeline.',
    ),
    model: b(
      'Seperti pengatur kecepatan video: 1 adalah normal, 0.5 adalah setengah kecepatan, dan 2 dua kali lebih cepat.',
      'Like video speed controls: 1 is normal, 0.5 is half speed, and 2 is twice as fast.',
    ),
    explanation: b(
      'timeScale() mengubah laju waktu lokal. Durasi yang tertulis pada tiap tween tetap sama, sehingga track masih menunjukkan rancangan aslinya. Waktu nyata untuk menyelesaikan timeline menjadi lebih panjang saat laju diperkecil. Ini berguna untuk meneliti detail transisi.',
      'timeScale() changes the rate of local time. The written tween durations stay unchanged, so tracks still show the original design. The real time needed to finish grows when the rate is reduced. This is useful for examining transition details.',
    ),
    steps: [
      b('Jalankan timeline pada laju 1.', 'Run the timeline at rate 1.'),
      b(
        'Ubah tl.timeScale(1) menjadi tl.timeScale(0.5).',
        'Change tl.timeScale(1) to tl.timeScale(0.5).',
      ),
      b(
        'Bandingkan track yang tetap sama dengan pemutaran yang lebih lambat.',
        'Compare the unchanged tracks with the slower playback.',
      ),
    ],
    mistake: b(
      '0.5 berarti lebih lambat, bukan durasi setengah. Gunakan 2 untuk dua kali lebih cepat.',
      '0.5 means slower, not half the duration. Use 2 for twice the speed.',
    ),
    recap: [
      b(
        'timeScale mengubah laju, bukan isi tween.',
        'timeScale changes the rate, not the tween content.',
      ),
      b('Laju kecil membantu mengamati detail.', 'A slower rate helps inspect details.'),
    ],
    challenge: {
      title: b('Tonton dengan setengah kecepatan', 'Watch at half speed'),
      task: b('Jalankan timeline dengan timeScale(0.5).', 'Run the timeline with timeScale(0.5).'),
      hints: [
        b('Cari pemanggilan pada baris terakhir.', 'Find the call on the last line.'),
        b('Ubah argumen 1 menjadi 0.5.', 'Change the argument from 1 to 0.5.'),
      ],
      rule: 'speed',
    },
  }),
  lesson({
    id: 'callbacks',
    module: 4,
    scene: 'cards',
    minutes: 11,
    title: b('Tanggapi akhir animasi dengan callback', 'Respond to completion with a callback'),
    description: b(
      'Perbarui status ketika animasi benar-benar selesai.',
      'Update status when an animation actually finishes.',
    ),
    concept: 'onComplete · callback',
    objective: b('Menjalankan fungsi saat tween selesai.', 'Run a function when a tween finishes.'),
    model: b(
      'Callback seperti pesan “sudah sampai”. GSAP memanggil fungsi yang kamu berikan ketika waktunya tiba.',
      'A callback is an “arrived” message. GSAP calls the function you provide when the right moment arrives.',
    ),
    explanation: b(
      'onComplete menerima fungsi, bukan hasil pemanggilan fungsi. () => { ... } adalah fungsi singkat. textContent mengganti teks sebuah elemen. Dengan stagger, callback tween kelompok ini berjalan setelah seluruh kelompok selesai. Gunakan status yang membantu pengguna memahami hasil.',
      'onComplete receives a function, not the result of calling one. () => { ... } is a short function. textContent updates an element’s text. With stagger, this group tween’s callback runs after the group finishes. Use status text that helps users understand the result.',
    ),
    steps: [
      b(
        'Jalankan dan tunggu sampai status berubah menjadi Ready.',
        'Run and wait until the status becomes Ready.',
      ),
      b('Ganti teks callback menjadi Complete.', 'Change the callback text to Complete.'),
      b(
        'Jalankan ulang, lalu amati kapan status berubah.',
        'Run again and notice when the status changes.',
      ),
    ],
    mistake: b(
      'Jangan memanggil fungsi langsung saat menulis onComplete. Berikan fungsi agar GSAP dapat memanggilnya nanti.',
      'Do not invoke the function while assigning onComplete. Give GSAP a function to call later.',
    ),
    recap: [
      b(
        'Callback menghubungkan waktu animasi dan tindakan.',
        'Callbacks connect animation timing with actions.',
      ),
      b('onComplete menunggu tween selesai.', 'onComplete waits for the tween to finish.'),
    ],
    challenge: {
      title: b('Beritahu bahwa kartu siap', 'Announce that the cards are ready'),
      task: b(
        'Ubah status menjadi "Complete" melalui onComplete, lalu tunggu animasi selesai sebelum memeriksa.',
        'Set the status to "Complete" through onComplete, then wait for playback to finish before checking.',
      ),
      hints: [
        b('Ubah string di dalam fungsi onComplete.', 'Edit the string inside onComplete.'),
        b('Gunakan huruf besar C pada "Complete".', 'Use a capital C in "Complete".'),
      ],
      rule: 'callbacks',
    },
  }),
  lesson({
    id: 'overwrite',
    module: 4,
    scene: 'interaction',
    minutes: 11,
    title: b('Tangani klik berulang dengan overwrite', 'Handle repeated clicks with overwrite'),
    description: b(
      'Beri target satu instruksi aktif untuk properti yang sama.',
      'Give each property one active instruction.',
    ),
    concept: 'overwrite: "auto"',
    objective: b(
      'Menghindari tween yang saling berebut properti.',
      'Avoid tweens competing over the same property.',
    ),
    model: b(
      'Dua orang memberi arah berbeda pada kotak yang sama. overwrite: "auto" membiarkan instruksi baru mengambil alih properti yang bertabrakan pada tween aktif.',
      'Two people give the same box different directions. overwrite: "auto" lets a new instruction take over conflicting properties on active tweens.',
    ),
    explanation: b(
      'Klik membuat tween baru dari keadaan sekarang. Mode auto menimpa properti yang bertabrakan ketika tween mulai, sambil menjaga properti lain yang tidak bertabrakan. Gunakan satu tween yang diputar ulang jika tujuannya selalu sama; buat tween baru ketika tujuan bergantung pada interaksi.',
      'A click creates a new tween from the current state. Auto mode overwrites conflicting properties when it initializes while preserving unrelated ones. Reuse one tween when the destination stays the same; create new tweens when destinations depend on interaction.',
    ),
    steps: [
      b('Jalankan kode untuk memasang event tombol.', 'Run the code to attach the button event.'),
      b(
        'Ubah x pada tween di dalam event menjadi 240.',
        'Set x on the tween inside the event to 240.',
      ),
      b(
        'Jalankan, lalu klik tombol preview beberapa kali.',
        'Run, then click the preview button several times.',
      ),
    ],
    mistake: b(
      'Menghapus overwrite dapat menimbulkan konflik saat nilai tujuan berubah cepat. Ini berbeda dari restart pada tween yang sama.',
      'Removing overwrite can introduce conflicts when destinations change quickly. This differs from restarting the same tween.',
    ),
    recap: [
      b('auto menangani properti yang bertabrakan.', 'auto handles conflicting properties.'),
      b(
        'Target baru dihitung saat event berjalan.',
        'The new destination is read when the event runs.',
      ),
    ],
    challenge: {
      title: b('Klik menuju tujuan baru', 'Click toward a new destination'),
      task: b(
        'Pertahankan overwrite: "auto", ubah x tween event ke 240 atau lebih, lalu klik tombol preview.',
        'Keep overwrite: "auto", set event tween x to at least 240, then click the preview button.',
      ),
      hints: [
        b('Edit tween di dalam addEventListener.', 'Edit the tween inside addEventListener.'),
        b(
          'Jalankan kode sebelum mengaktifkan tombol preview.',
          'Run the code before activating the preview button.',
        ),
      ],
      rule: 'overwrite',
    },
  }),
  lesson({
    id: 'utils',
    module: 4,
    scene: 'box',
    minutes: 9,
    title: b('Batasi nilai dengan utils.clamp()', 'Limit values with utils.clamp()'),
    description: b(
      'Ubah input menjadi nilai yang aman untuk animasi.',
      'Turn input into a bounded animation value.',
    ),
    concept: 'gsap.utils.clamp()',
    objective: b(
      'Menghitung tujuan dari batas minimum dan maksimum.',
      'Calculate a destination using minimum and maximum bounds.',
    ),
    model: b(
      'Clamp seperti pagar: nilai boleh berubah di dalam rentang, tetapi berhenti pada batasnya.',
      'Clamp is a fence: values can change inside the range but stop at its edges.',
    ),
    explanation: b(
      'clamp(minimum, maksimum, input) mengembalikan angka. Pada clamp(0, 180, 360), input 360 melampaui batas atas sehingga hasilnya 180. GSAP kemudian menerima angka hasil itu sebagai x. Fungsi utilitas tidak membuat animasi sendiri.',
      'clamp(minimum, maximum, input) returns a number. In clamp(0, 180, 360), input 360 exceeds the upper bound, so the result is 180. GSAP receives that result as x. Utility functions do not create animations themselves.',
    ),
    steps: [
      b('Prediksi hasil clamp sebelum menjalankan.', 'Predict the clamp result before running.'),
      b('Ubah batas maksimum dari 180 menjadi 240.', 'Change the maximum from 180 to 240.'),
      b(
        'Coba input 100 untuk melihat nilai yang berada dalam rentang.',
        'Try input 100 to see a value inside the range.',
      ),
    ],
    mistake: b(
      'Urutan argumennya minimum, maksimum, input. Tertukar urutan akan mengubah hasil perhitungan.',
      'The order is minimum, maximum, input. Swapping arguments changes the calculation.',
    ),
    recap: [
      b('Utilitas menghasilkan nilai untuk tween.', 'Utilities produce values for tweens.'),
      b(
        'Clamp berguna untuk input slider, pointer, dan progres.',
        'Clamp is useful for slider, pointer, and progress input.',
      ),
    ],
    challenge: {
      title: b('Perluas batas atas', 'Raise the upper bound'),
      task: b(
        'Gunakan clamp(0, 240, 360) sehingga tween menuju x: 240.',
        'Use clamp(0, 240, 360) so the tween reaches x: 240.',
      ),
      hints: [
        b(
          'Ubah argumen kedua, pertahankan input 360.',
          'Edit the second argument and keep input 360.',
        ),
        b('Nilai x di tween tetap limitedX.', 'Keep limitedX as the tween’s x value.'),
      ],
      rule: 'utils',
    },
  }),
  lesson({
    id: 'scroll-timeline',
    module: 5,
    scene: 'scroll',
    minutes: 14,
    title: b('Hubungkan satu timeline dengan scroll', 'Connect a timeline to scrolling'),
    description: b(
      'Susun dua adegan dalam satu rentang scroll.',
      'Sequence two scenes in one scroll range.',
    ),
    concept: 'timeline · ScrollTrigger · scrub',
    objective: b(
      'Membagi rentang scroll ke beberapa tween secara proporsional.',
      'Divide a scroll range proportionally across several tweens.',
    ),
    model: b(
      'Bayangkan scroll sebagai jari yang menyeret playhead sebuah film pendek. Semua tween dalam timeline mengikuti playhead yang sama.',
      'Imagine scrolling as a finger dragging a short film’s playhead. Every tween in the timeline follows that same playhead.',
    ),
    explanation: b(
      'ScrollTrigger dipasang pada timeline induk. Tween anak cukup menjelaskan perubahan visual. Durasi 1 dan 0.5 membagi rangkaian dengan proporsi 2 banding 1. end menentukan panjang scroll keseluruhan. Hindari memasang ScrollTrigger lain pada anak yang sudah dikendalikan timeline yang sama.',
      'ScrollTrigger belongs on the parent timeline. Child tweens describe visual changes. Durations of 1 and 0.5 divide the sequence in a 2-to-1 ratio. end sets the overall scroll distance. Avoid putting another ScrollTrigger on children already controlled by that timeline.',
    ),
    steps: [
      b(
        'Jalankan lalu geser progres scroll perlahan.',
        'Run and scrub the scroll progress slowly.',
      ),
      b(
        'Amati kotak selesai sebelum teks muncul.',
        'Notice the box finishing before the caption appears.',
      ),
      b(
        'Ubah rotation dari 90 menjadi 180 dan jalankan lagi.',
        'Change rotation from 90 to 180 and run again.',
      ),
    ],
    mistake: b(
      'Tween anak yang punya ScrollTrigger sendiri akan punya pengendali kedua. Pasang pemicu pada induknya untuk contoh ini.',
      'A child with its own ScrollTrigger has a second controller. Put the trigger on the parent for this example.',
    ),
    recap: [
      b(
        'Satu pemicu dapat mengendalikan satu rangkaian utuh.',
        'One trigger can control a whole sequence.',
      ),
      b(
        'Durasi anak mengatur proporsi rentang.',
        'Child durations define proportions of the range.',
      ),
    ],
    challenge: {
      title: b('Dua adegan, satu pengendali', 'Two scenes, one controller'),
      task: b(
        'Pertahankan timeline scroll dengan dua tween, aktifkan scrub, dan putar kotak minimal 180 derajat.',
        'Keep a scroll timeline with two tweens, enable scrub, and rotate the box at least 180 degrees.',
      ),
      hints: [
        b('Ubah rotation pada tween kotak.', 'Edit rotation on the box tween.'),
        b('Biarkan scrollTrigger pada gsap.timeline().', 'Keep scrollTrigger on gsap.timeline().'),
      ],
      rule: 'scroll-timeline',
    },
  }),
  lesson({
    id: 'svg-attributes',
    module: 6,
    scene: 'svg',
    minutes: 11,
    title: b('Animasikan atribut SVG', 'Animate SVG attributes'),
    description: b(
      'Ubah bentuk lingkaran dengan AttrPlugin bawaan.',
      'Change a circle using the built-in AttrPlugin.',
    ),
    concept: 'attr · SVG · r · cx',
    objective: b(
      'Mengubah radius dan koordinat lingkaran SVG.',
      'Change an SVG circle’s radius and coordinate.',
    ),
    model: b(
      'SVG menggambar dengan koordinat. r adalah radius lingkaran, cx pusat horizontal, dan cy pusat vertikal.',
      'SVG draws with coordinates. r is a circle’s radius, cx its horizontal center, and cy its vertical center.',
    ),
    explanation: b(
      'Atribut ditulis di dalam attr: { ... }, bukan sebagai properti CSS biasa. AttrPlugin sudah termasuk GSAP core. viewBox menetapkan kertas koordinat SVG; ukuran layar dapat berubah sementara koordinatnya tetap konsisten. Perubahan r membesar ke semua arah dari titik pusat.',
      'Attributes go inside attr: { ... }, rather than being ordinary CSS properties. AttrPlugin is included in GSAP core. The viewBox defines the SVG coordinate sheet; screen size can change while its coordinates remain consistent. Changing r expands the circle in every direction from its center.',
    ),
    steps: [
      b(
        'Buka tab HTML untuk menemukan circle dan viewBox.',
        'Open HTML to find the circle and viewBox.',
      ),
      b('Ubah r menjadi 50 dan cx menjadi 120.', 'Set r to 50 and cx to 120.'),
      b(
        'Geser progres untuk memeriksa perubahan ukuran dan pusat.',
        'Scrub progress to inspect size and center changes.',
      ),
    ],
    mistake: b(
      'x pada transform dan cx pada atribut adalah dua cara berbeda. Untuk latihan ini, ubah atribut dalam attr.',
      'Transform x and attribute cx are different mechanisms. Edit the attributes inside attr for this exercise.',
    ),
    recap: [
      b('AttrPlugin bawaan menganimasikan atribut.', 'Built-in AttrPlugin animates attributes.'),
      b('viewBox menentukan sistem koordinat SVG.', 'viewBox defines the SVG coordinate system.'),
    ],
    challenge: {
      title: b('Lingkaran lebih besar', 'A larger circle'),
      task: b(
        'Animasikan .shape dengan attr r: 50 dan cx: 120.',
        'Animate .shape with attr r: 50 and cx: 120.',
      ),
      hints: [
        b('Ubah angka dalam objek attr.', 'Change the numbers inside attr.'),
        b(
          'Pertahankan cy agar pusat vertikal tidak berubah.',
          'Keep cy unchanged to preserve the vertical center.',
        ),
      ],
      rule: 'svg-attributes',
    },
  }),
  lesson({
    id: 'svg-stroke',
    module: 6,
    scene: 'svg',
    minutes: 12,
    title: b('Gambar garis SVG secara bertahap', 'Draw an SVG stroke progressively'),
    description: b(
      'Pahami dasharray dan dashoffset tanpa plugin tambahan.',
      'Understand dasharray and dashoffset without an extra plugin.',
    ),
    concept: 'strokeDasharray · strokeDashoffset',
    objective: b(
      'Membuat efek garis yang tergambar dari awal ke akhir.',
      'Create a stroke that appears to draw from start to finish.',
    ),
    model: b(
      'Bayangkan garis putus-putus yang satu potongnya sepanjang seluruh jalur. Menggeser offset-nya membuka jalur sedikit demi sedikit.',
      'Imagine a dashed stroke with one dash as long as the entire path. Moving its offset reveals the path a little at a time.',
    ),
    explanation: b(
      'getTotalLength() membaca panjang path dalam satuan SVG. Nilai itu dipakai untuk dasharray dan offset awal. Offset tujuan 0 memperlihatkan seluruh garis. Contoh ini memakai properti stroke standar browser; DrawSVG adalah plugin terpisah untuk kontrol bentuk yang lebih lanjut.',
      'getTotalLength() reads a path’s length in SVG units. That length becomes the dasharray and starting offset. A destination offset of 0 reveals the whole stroke. This example uses standard browser stroke properties; DrawSVG is a separate plugin for more advanced shape control.',
    ),
    steps: [
      b(
        'Jalankan dan amati ujung garis yang belum selesai.',
        'Run and observe the unfinished end of the stroke.',
      ),
      b('Ganti strokeDashoffset pada objek tujuan ke 0.', 'Set destination strokeDashoffset to 0.'),
      b('Periksa hasil di 0%, 50%, dan 100%.', 'Inspect the result at 0%, 50%, and 100%.'),
    ],
    mistake: b(
      'Efek ini membutuhkan stroke yang terlihat. Fill pada bentuk tidak akan tergambar lewat dashoffset.',
      'This effect requires a visible stroke. A shape’s fill is not drawn by dashoffset.',
    ),
    recap: [
      b(
        'Panjang path memberi ukuran dash yang tepat.',
        'Path length provides the correct dash size.',
      ),
      b('Offset nol membuka seluruh stroke.', 'A zero offset reveals the full stroke.'),
    ],
    challenge: {
      title: b('Selesaikan garisnya', 'Finish the stroke'),
      task: b(
        'Pertahankan fromTo() pada outline dan ubah strokeDashoffset tujuan menjadi 0.',
        'Keep fromTo() on the outline and set destination strokeDashoffset to 0.',
      ),
      hints: [
        b('Ubah objek ketiga pada gsap.fromTo().', 'Edit the third argument of gsap.fromTo().'),
        b(
          'Offset awal tetap length; offset akhir menjadi 0.',
          'Keep the starting offset as length; make the final offset 0.',
        ),
      ],
      rule: 'svg-stroke',
    },
  }),
  lesson({
    id: 'motion-path',
    module: 6,
    scene: 'path',
    minutes: 14,
    title: b('Ikuti jalur dengan MotionPath', 'Follow a route with MotionPath'),
    description: b(
      'Gabungkan path, alignment, dan rotasi otomatis.',
      'Combine a path, alignment, and automatic rotation.',
    ),
    concept: 'MotionPathPlugin · path · align',
    objective: b(
      'Menganimasikan penanda sepanjang satu jalur SVG.',
      'Animate a marker along an SVG path.',
    ),
    model: b(
      'Jalur SVG adalah rel; penanda adalah keretanya. MotionPath membaca rel itu dan mengatur posisi penanda.',
      'The SVG path is a rail and the marker is a train. MotionPath reads that rail and positions the marker along it.',
    ),
    explanation: b(
      'path memilih jalur. align menyamakan sistem koordinat penanda dengan jalur. alignOrigin: [0.5, 0.5] menempatkan pusat penanda di rel. autoRotate mengikuti arah jalur. end: 1 berarti seluruh panjang; 0.65 hanya 65%. MotionPathPlugin sudah disiapkan di ruang praktik ini.',
      'path selects the route. align reconciles the marker’s coordinates with the path. alignOrigin: [0.5, 0.5] places the marker’s center on the rail. autoRotate follows the route’s direction. end: 1 covers the whole path; 0.65 covers 65%. MotionPathPlugin is ready in this practice space.',
    ),
    steps: [
      b(
        'Jalankan dan perhatikan penanda berhenti sebelum ujung jalur.',
        'Run and notice the marker stopping before the end.',
      ),
      b('Ubah end ke 1.', 'Set end to 1.'),
      b(
        'Coba autoRotate: false untuk membandingkan orientasi.',
        'Try autoRotate: false to compare orientation.',
      ),
    ],
    mistake: b(
      'path dan align punya fungsi berbeda. Menghapus align dapat membuat penanda tampak bergeser dari jalurnya.',
      'path and align serve different purposes. Removing align can offset the marker from the route.',
    ),
    recap: [
      b('end memakai proporsi panjang jalur.', 'end uses a proportion of the route length.'),
      b(
        'autoRotate mengikuti arah tangen jalur.',
        'autoRotate follows the path’s tangent direction.',
      ),
    ],
    challenge: {
      title: b('Sampai ke ujung rel', 'Reach the end of the rail'),
      task: b(
        'Gunakan MotionPath dengan end: 1 dan autoRotate: true.',
        'Use MotionPath with end: 1 and autoRotate: true.',
      ),
      hints: [
        b('Ubah end di dalam objek motionPath.', 'Edit end inside motionPath.'),
        b('Pertahankan path dan align pada .route.', 'Keep path and align set to .route.'),
      ],
      rule: 'motion-path',
    },
  }),
  lesson({
    id: 'context',
    module: 7,
    scene: 'cards-action',
    minutes: 14,
    title: b('Rapikan animasi dengan context()', 'Clean up animations with context()'),
    description: b(
      'Pelajari scope dan revert sebelum memakai GSAP di komponen.',
      'Learn scope and revert before using GSAP in components.',
    ),
    concept: 'gsap.context() · revert()',
    objective: b(
      'Mengumpulkan tween dalam scope dan memulihkan style awalnya.',
      'Collect scoped tweens and restore their original styles.',
    ),
    model: b(
      'Context seperti kotak peralatan untuk satu bagian halaman. Saat bagian itu selesai dipakai, revert mengembalikan hasil pemasangannya.',
      'A context is a toolbox for one page section. When the section is no longer needed, revert undoes its setup.',
    ),
    explanation: b(
      'Selector di dalam context dibatasi oleh scope yang diberikan. ctx.revert() membunuh animasi yang dikumpulkan dan memulihkan style inline sebelumnya. Ini penting saat komponen dilepas atau animasi disiapkan ulang. Dalam React, pola ini juga ditangani useGSAP dari paket integrasi resmi; latihan ini mempelajari dasarnya dengan DOM biasa.',
      'Selectors inside the context are limited to its scope. ctx.revert() kills collected animations and restores previous inline styles. This matters when components unmount or animations are set up again. React’s official useGSAP integration also handles this pattern; here you learn the underlying DOM mechanism.',
    ),
    steps: [
      b('Jalankan dan amati tiga kartu masuk.', 'Run and observe the three cards entering.'),
      b('Tambahkan scale: 0.8 ke tween from().', 'Add scale: 0.8 to the from() tween.'),
      b(
        'Jalankan lalu klik tombol preview untuk revert; periksa kartu kembali ke CSS awal.',
        'Run and click the preview button to revert; inspect the cards returning to their initial CSS.',
      ),
    ],
    mistake: b(
      'pause() hanya menjeda animasi; ia tidak memulihkan style awal seperti revert(). Listener DOM yang dipasang dengan addEventListener tetap perlu dibersihkan sendiri dengan removeEventListener saat komponen dilepas.',
      'pause() only pauses playback; it does not restore original styles like revert(). DOM listeners installed with addEventListener still need their own removeEventListener cleanup when a component unmounts.',
    ),
    recap: [
      b(
        'Scope membatasi selector ke bagian yang relevan.',
        'Scope limits selectors to the relevant section.',
      ),
      b(
        'revert memulihkan style dan membersihkan animasi.',
        'revert restores styles and cleans up animations.',
      ),
    ],
    challenge: {
      title: b('Pasang lalu pulihkan', 'Set up, then restore'),
      task: b(
        'Tambahkan scale: 0.8 pada from() kartu, jalankan, lalu klik tombol preview untuk memulihkan style melalui ctx.revert().',
        'Add scale: 0.8 to the cards’ from() tween, run, then click the preview button to restore styles through ctx.revert().',
      ),
      hints: [
        b(
          'Tambahkan scale di dalam tween, bukan di context.',
          'Add scale inside the tween, not on context.',
        ),
        b(
          'Sesudah menjalankan, aktifkan tombol preview sebelum memeriksa.',
          'After running, activate the preview button before checking.',
        ),
      ],
      rule: 'context',
    },
  }),
  lesson({
    id: 'match-media',
    module: 7,
    scene: 'items',
    minutes: 13,
    title: b('Sesuaikan animasi dengan matchMedia()', 'Adapt animation with matchMedia()'),
    description: b(
      'Buat aturan layar lebar dan ringkas yang bisa dibersihkan.',
      'Create wide and compact rules with automatic cleanup.',
    ),
    concept: 'gsap.matchMedia() · conditions',
    objective: b(
      'Memilih konfigurasi berdasarkan ukuran viewport preview.',
      'Choose a configuration using the preview viewport size.',
    ),
    model: b(
      'MatchMedia seperti dua resep untuk bahan yang sama: satu untuk ruang luas dan satu untuk ruang ringkas.',
      'MatchMedia is like two recipes for the same ingredients: one for a large space and one for a compact one.',
    ),
    explanation: b(
      'Kondisi wide dan compact berasal dari media query. context.conditions berisi boolean untuk setiap kondisi. Operator ? : memilih nilai berdasarkan boolean. GSAP merevert animasi saat kondisi berubah lalu memasang konfigurasi yang sesuai. Ukuran yang dibaca di sini adalah iframe preview, bukan keseluruhan jendela aplikasi.',
      'The wide and compact conditions come from media queries. context.conditions contains a boolean for each. The ? : operator picks a value from that boolean. GSAP reverts animations when conditions change and sets up the appropriate configuration. Here the viewport is the preview iframe, not the whole application window.',
    ),
    steps: [
      b(
        'Jalankan dan perhatikan jarak masuk pada ukuran preview saat ini.',
        'Run and observe the entrance distance at the current preview size.',
      ),
      b('Ubah duration menjadi 2 untuk kedua kondisi.', 'Set duration to 2 for both conditions.'),
      b(
        'Ubah lebar jendela dan jalankan lagi untuk membandingkan hasil.',
        'Resize the window and run again to compare the result.',
      ),
    ],
    mistake: b(
      'Breakpoint mengukur iframe pada contoh ini. Preview yang ringkas bisa memakai compact meskipun monitor kamu lebar.',
      'This example’s breakpoint measures the iframe. A compact preview can use compact rules even on a wide monitor.',
    ),
    recap: [
      b(
        'Media query memilih konfigurasi, bukan mengunci pelajaran.',
        'Media queries choose a configuration; they do not lock the lesson.',
      ),
      b(
        'MatchMedia mengumpulkan dan merevert animasi saat aturan berubah.',
        'MatchMedia collects and reverts animations when rules change.',
      ),
    ],
    challenge: {
      title: b('Dua ukuran, tempo yang sama', 'Two sizes, the same tempo'),
      task: b(
        'Pertahankan matchMedia dan buat tween di kondisi aktif berdurasi minimal 2 detik.',
        'Keep matchMedia and make the active condition’s tween last at least 2 seconds.',
      ),
      hints: [
        b('Ubah konstanta duration di bagian atas.', 'Change the duration constant at the top.'),
        b(
          'Biarkan pemilihan nilai y menggunakan context.conditions.',
          'Keep the y value selected through context.conditions.',
        ),
      ],
      rule: 'match-media',
    },
  }),
  lesson({
    id: 'reduced-motion',
    module: 7,
    scene: 'cards',
    minutes: 13,
    title: b('Hormati preferensi animasi pengguna', 'Respect animation preferences'),
    description: b(
      'Pertahankan informasi ketika animasi dikurangi.',
      'Preserve information when motion is reduced.',
    ),
    concept: 'prefers-reduced-motion · matchMedia',
    objective: b(
      'Menyediakan tampilan yang nyaman tanpa menghilangkan konten.',
      'Provide a comfortable experience without removing content.',
    ),
    model: b(
      'Animasi membantu orientasi, tetapi pengguna boleh memilih pengalaman yang lebih tenang. Pesan dan fungsi antarmuka tetap harus tersedia.',
      'Animation can aid orientation, but people may prefer a calmer experience. Interface meaning and functionality must remain available.',
    ),
    explanation: b(
      'prefers-reduced-motion berasal dari pengaturan sistem. Contoh memakai duration: 0 dan y: 0 ketika reduce aktif. Pada cabang penuh, efek tetap singkat dan terbatas. Toggle Kurangi animasi milik RanMotion juga dapat membekukan preview ke hasil akhir; toggle aplikasi dan media query sistem adalah dua sumber pengaturan yang berbeda.',
      'prefers-reduced-motion comes from system settings. This example uses duration: 0 and y: 0 when reduce is active. The full-motion branch stays brief and bounded. RanMotion’s Reduce motion toggle can also freeze the preview at its final state; the application toggle and the system media query are separate preference sources.',
    ),
    steps: [
      b(
        'Jalankan dan baca kondisi reduce di dalam callback.',
        'Run and read the reduce condition inside the callback.',
      ),
      b(
        'Tambahkan scale: reduce ? 1 : 0.9 pada tween.',
        'Add scale: reduce ? 1 : 0.9 to the tween.',
      ),
      b(
        'Bandingkan dengan pengaturan pengurangan animasi di perangkatmu.',
        'Compare with the reduced-motion setting on your device.',
      ),
    ],
    mistake: b(
      'Menghapus kartu saat reduce aktif akan menghilangkan informasi. Tampilkan keadaan akhir yang tetap lengkap.',
      'Removing cards when reduce is active removes information. Show a complete final state instead.',
    ),
    recap: [
      b(
        'Preferensi sistem dapat dibaca lewat media query.',
        'Media queries can read the system preference.',
      ),
      b(
        'Kurangi efek sambil mempertahankan informasi dan kontrol.',
        'Reduce effects while preserving information and controls.',
      ),
    ],
    challenge: {
      title: b('Skala yang menghormati preferensi', 'A preference-aware scale'),
      task: b(
        'Tambahkan scale: reduce ? 1 : 0.9 dalam tween matchMedia.',
        'Add scale: reduce ? 1 : 0.9 in the matchMedia tween.',
      ),
      hints: [
        b('Tambahkan properti sejajar dengan opacity.', 'Add the property next to opacity.'),
        b(
          'Cabang reduce memakai 1, cabang penuh 0.9.',
          'Use 1 for reduced motion and 0.9 for full motion.',
        ),
      ],
      rule: 'reduced-motion',
    },
  }),
  lesson({
    id: 'project-menu',
    module: 8,
    scene: 'cards-action',
    minutes: 20,
    title: b('Mini proyek: menu kartu berurutan', 'Mini project: a staggered card menu'),
    description: b(
      'Satukan event, timeline, dan stagger dalam antarmuka kecil.',
      'Combine events, a timeline, and stagger in a small interface.',
    ),
    concept: 'mini project · timeline · event',
    objective: b(
      'Membuat rangkaian masuk yang diputar ulang oleh tombol.',
      'Build an entrance sequence that a button can replay.',
    ),
    model: b(
      'Menu ini punya satu cerita dan satu tombol pemicu. Siapkan cerita dahulu, lalu hubungkan tombolnya.',
      'This menu has one story and one trigger button. Prepare the story first, then connect its trigger.',
    ),
    explanation: b(
      'paused: true menyiapkan timeline tanpa memutarnya. from() memberi keadaan awal bagi tiga kartu. Stagger mengatur selisih kedatangan. Event tombol memanggil restart() sehingga klik berikutnya bisa memutar cerita yang sama. Ini adalah latihan menu visual; pola menu navigasi produksi juga membutuhkan pengelolaan fokus dan status terbuka.',
      'paused: true prepares the timeline without playing it. from() gives three cards a starting state. Stagger sets the arrival gap. The button calls restart() so another click can replay the same story. This is a visual menu exercise; a production navigation menu also needs focus management and open-state semantics.',
    ),
    steps: [
      b(
        'Jalankan kode, lalu aktifkan tombol di dalam preview.',
        'Run the code, then activate the preview button.',
      ),
      b('Ubah stagger menjadi 0.25.', 'Set stagger to 0.25.'),
      b(
        'Klik ulang dan bandingkan keterbacaan urutan.',
        'Click again and compare how clearly the sequence reads.',
      ),
    ],
    mistake: b(
      'Jalankan kode memasang event; tombol preview memutar rangkaian. Keduanya punya peran berbeda.',
      'Run code installs the event; the preview button plays the sequence. They have different roles.',
    ),
    recap: [
      b(
        'Timeline memisahkan rancangan animasi dari pemicunya.',
        'A timeline separates animation design from its trigger.',
      ),
      b(
        'Urutan yang terbaca lebih penting dari banyak efek.',
        'A readable sequence matters more than piling on effects.',
      ),
    ],
    challenge: {
      title: b('Tiga kartu dengan ritme yang jelas', 'Three cards with a clear rhythm'),
      task: b(
        'Gunakan stagger minimal 0.2 pada from() ketiga .card, jalankan kode, lalu klik tombol preview.',
        'Use a stagger of at least 0.2 on the three .card elements’ from() tween, run, then click the preview button.',
      ),
      hints: [
        b('Ubah stagger di dalam tl.from().', 'Edit stagger inside tl.from().'),
        b(
          'Sesudah menjalankan, klik tombol di dalam preview.',
          'After running, click the button inside the preview.',
        ),
      ],
      rule: 'project-menu',
    },
  }),
]
