import { b } from './types'
import type { Lesson, PracticeLesson } from './types'
import { examples } from './examples'
import { expandedLessons } from './expandedCurriculum'
import { introLessons } from './introCurriculum'

export const modules = [
  {
    number: 0,
    title: b('Pahami dasar animasi', 'Learn animation basics'),
    description: b(
      'Siapkan cara berpikir dan kenali ruang praktikmu.',
      'Build your mental model and find your way around the playground.',
    ),
    topics: 'GSAP · visual study · playground · selector',
  },
  {
    number: 1,
    title: b('Animasi pertamamu', 'Your first animation'),
    description: b(
      'Hubungkan keadaan awal, tujuan, dan waktu.',
      'Connect a starting state, a destination, and time.',
    ),
    topics: 'transform · to · from · set',
  },
  {
    number: 2,
    title: b('Atur ritme animasi', 'Shape animation timing'),
    description: b(
      'Animasi yang sama dapat terasa sangat berbeda.',
      'The same animation can feel completely different.',
    ),
    topics: 'easing · delay · repeat',
  },
  {
    number: 3,
    title: b('Rangkai sebuah cerita', 'Sequence a little story'),
    description: b(
      'Atur urutan, overlap, dan ritme beberapa elemen.',
      'Arrange order, overlap, and rhythm across elements.',
    ),
    topics: 'timeline · position · label · stagger',
  },
  {
    number: 4,
    title: b('Animasi interaktif', 'Interactive animation'),
    description: b(
      'Beri umpan balik pada klik, hover, dan fokus.',
      'Respond to clicks, hovering, and keyboard focus.',
    ),
    topics: 'event · play · reverse',
  },
  {
    number: 5,
    title: b('Ikuti alur scroll', 'Move with the scroll'),
    description: b(
      'Bedakan pemicu scroll dengan progres scroll.',
      'Understand scroll as a trigger and as a playhead.',
    ),
    topics: 'ScrollTrigger · scrub · pin',
  },
  {
    number: 6,
    title: b('Eksplorasi bentuk dan jalur SVG', 'Explore SVG shapes and paths'),
    description: b(
      'Kenali koordinat SVG, garis, dan MotionPath.',
      'Explore SVG coordinates, strokes, and MotionPath.',
    ),
    topics: 'attr · stroke · MotionPath',
  },
  {
    number: 7,
    title: b('Animasi yang siap dipakai', 'Animation ready for real interfaces'),
    description: b(
      'Sesuaikan ukuran, hormati preferensi, dan rapikan lifecycle.',
      'Adapt to sizes, respect preferences, and clean up lifecycle.',
    ),
    topics: 'context · matchMedia · reduced motion',
  },
  {
    number: 8,
    title: b('Buat versi kamu', 'Make it your own'),
    description: b(
      'Gabungkan ide menjadi satu bagian halaman interaktif.',
      'Bring your ideas together in an interactive page section.',
    ),
    topics: 'mini project · creative practice',
  },
]
type Input = Omit<PracticeLesson, 'code' | 'solution'> & { solution?: string }
function lesson(input: Input): PracticeLesson {
  return { ...input, code: examples[input.id], solution: input.solution ?? examples[input.id] }
}

const foundationLessons: PracticeLesson[] = [
  lesson({
    id: 'orientation',
    module: 0,
    title: b('Satu kotak, banyak kemungkinan', 'One box, many possibilities'),
    description: b(
      'Kenali editor, preview, dan tombol pemulihan.',
      'Get to know the editor, preview, and reset controls.',
    ),
    minutes: 6,
    concept: 'playground',
    scene: 'box',
    objective: b(
      'Menjalankan contoh, mengubah jarak perpindahan, dan memulihkan eksperimen.',
      'Run an example, change its travel distance, and restore the starting code.',
    ),
    model: b(
      'Bayangkan memberi instruksi pada sebuah benda: elemen mana yang dianimasikan, ke mana perubahannya, dan berapa lama. GSAP menerjemahkan instruksi itu menjadi perubahan kecil di setiap frame.',
      'Think of giving an object directions: which box should move, where, and for how long. GSAP turns those directions into small changes on every frame.',
    ),
    explanation: b(
      'Preview adalah halaman web kecil dengan elemen sungguhan. Editor berisi JavaScript yang mengendalikan elemen itu. Nilai distance adalah jarak dalam piksel; duration adalah waktu dalam detik. Perubahan kode baru diterapkan ketika kamu menekan Jalankan. Tombol Ulangi memutar hasil terakhir, sedangkan Reset mengembalikan kode dan keadaan awal.',
      'The preview is a small web page with real elements. JavaScript in the editor controls them. distance is measured in pixels and duration in seconds. Code changes take effect when you press Run. Replay restarts the last result, while Reset restores the original code and state.',
    ),
    steps: [
      b(
        'Jalankan kode dan amati posisi awal serta posisi akhir kotak.',
        'Run the code and observe the box at the start and finish.',
      ),
      b(
        'Ubah distance dari 180 menjadi 240. Jalankan lagi dan bandingkan.',
        'Change distance from 180 to 240. Run again and compare.',
      ),
      b(
        'Geser progres untuk memeriksa satu keadaan, lalu coba Reset.',
        'Scrub the progress control to inspect a state, then try Reset.',
      ),
    ],
    mistake: b(
      'Menulis 1.2s di JavaScript menghasilkan kesalahan. Gunakan angka 1.2; satuan detik sudah dipahami oleh duration.',
      'Writing 1.2s in JavaScript causes an error. Use the number 1.2; duration already uses seconds.',
    ),
    recap: [
      b(
        'Editor adalah instruksi; preview adalah hasilnya.',
        'The editor contains instructions; the preview shows the result.',
      ),
      b(
        'Jalankan menerapkan perubahan. Reset memulihkan contoh.',
        'Run applies edits. Reset restores the example.',
      ),
    ],
    challenge: {
      title: b('Bawa kotaknya lebih jauh', 'Move the box a little farther'),
      task: b(
        'Ubah distance menjadi 240 piksel atau lebih, lalu jalankan kode.',
        'Change distance to at least 240 pixels, then run the code.',
      ),
      hints: [
        b(
          'Cari konstanta distance di baris pertama.',
          'Find the distance constant on the first line.',
        ),
        b('Gunakan const distance = 240;', 'Use const distance = 240;'),
      ],
      rule: 'distance',
    },
    solution: examples.orientation.replace('180', '240'),
  }),
  lesson({
    id: 'selectors',
    module: 0,
    title: b('Pilih elemen yang akan dianimasikan', 'Choose what to animate'),
    description: b(
      'Hubungkan selector CSS dengan target animasi.',
      'Connect CSS selectors to animation targets.',
    ),
    minutes: 7,
    concept: 'target · selector',
    scene: 'items',
    objective: b(
      'Menganimasikan beberapa elemen dengan satu selector.',
      'Animate several elements with one selector.',
    ),
    model: b(
      'Selector adalah alamat elemen. ".item" memilih semua elemen dengan class item. ".item-1" memilih kotak pertama saja. GSAP tidak menebak targetmu; alamatnya harus cocok.',
      'A selector is an element’s address. ".item" selects every element with the item class. ".item-1" selects only the first box. GSAP needs an address that actually matches.',
    ),
    explanation: b(
      'Titik sebelum nama menandakan class CSS, sedangkan tanda # digunakan untuk id. Target bisa berupa selector, satu elemen DOM, atau kumpulan elemen. Contoh ini memakai tiga kotak dengan class item dan class unik item-1 sampai item-3. stagger memberi jeda kecil antar-target; kamu akan mempelajarinya lebih jauh nanti.',
      'A dot introduces a CSS class, while # introduces an id. A target can be a selector, a DOM element, or a collection of elements. These three boxes share the item class and have unique item-1 to item-3 classes. stagger adds a small delay between targets; we will explore it later.',
    ),
    steps: [
      b('Jalankan contoh dengan target .item.', 'Run the example targeting .item.'),
      b(
        'Ganti target menjadi .item-1 dan perhatikan kotak yang tetap diam.',
        'Change the target to .item-1 and notice which boxes remain still.',
      ),
      b(
        'Kembalikan ke .item, lalu tambahkan rotation: 45.',
        'Restore .item, then add rotation: 45.',
      ),
    ],
    mistake: b(
      'Selector "item" mencari tag <item>, bukan class. Gunakan ".item" agar ketiga kotak ditemukan.',
      'The selector "item" looks for an <item> tag, not a class. Use ".item" to find all three boxes.',
    ),
    recap: [
      b(
        'Selector harus cocok dengan elemen preview.',
        'Selectors must match the preview elements.',
      ),
      b('Satu tween bisa menargetkan banyak elemen.', 'One tween can target multiple elements.'),
    ],
    challenge: {
      title: b('Putar seluruh kelompok', 'Rotate the whole group'),
      task: b(
        'Animasikan ketiga .item dengan rotation: 45 atau lebih.',
        'Animate all three .item elements with rotation of at least 45.',
      ),
      hints: [
        b('Gunakan target .item, bukan .item-1.', 'Target .item rather than .item-1.'),
        b(
          'Tambahkan rotation: 45 di dalam objek properti.',
          'Add rotation: 45 inside the properties object.',
        ),
      ],
      rule: 'selectors',
    },
    solution: examples.selectors.replace('y: -40,', 'y: -40,\n  rotation: 45,'),
  }),
  lesson({
    id: 'properties',
    module: 1,
    title: b('Posisi, skala, dan transparansi', 'Position, scale, and opacity'),
    description: b(
      'Pahami properti yang paling sering dianimasikan.',
      'Understand the properties you will animate most often.',
    ),
    minutes: 8,
    concept: 'x · scale · opacity',
    scene: 'box',
    objective: b(
      'Menggabungkan transform dan opacity dalam satu tween.',
      'Combine transforms and opacity in one tween.',
    ),
    model: b(
      'Properti menggambarkan keadaan elemen. x menggeser posisi relatif, scale mengubah ukuran relatif, rotation memutar dalam derajat, dan opacity mengatur keterlihatan dari 0 sampai 1.',
      'Properties describe an element’s state. x offsets its position, scale changes its relative size, rotation turns it in degrees, and opacity controls visibility from 0 to 1.',
    ),
    explanation: b(
      'Nilai x: 180 menggeser elemen 180 piksel dari posisi layout-nya, tanpa memindahkan elemen lain. scale: 0.7 berarti 70% dari ukuran awal. Beberapa properti dalam tween yang sama berubah bersamaan. Transform dan opacity biasanya cocok untuk animasi antarmuka karena tidak perlu mengubah susunan layout setiap frame.',
      'x: 180 offsets an element by 180 pixels without moving its neighbors in the layout. scale: 0.7 means 70% of its original size. Properties in the same tween change together. Transforms and opacity are useful for interface animation because they avoid rearranging the layout on every frame.',
    ),
    steps: [
      b(
        'Jalankan contoh dan amati pergeseran, putaran, dan skala sekaligus.',
        'Run and observe translation, rotation, and scaling together.',
      ),
      b('Ubah scale menjadi 0.7.', 'Change scale to 0.7.'),
      b(
        'Tambahkan opacity: 0.5, lalu bandingkan keadaan akhirnya.',
        'Add opacity: 0.5 and compare the final state.',
      ),
    ],
    mistake: b(
      'opacity: 50 bukan berarti 50%. Gunakan opacity: 0.5. Untuk mengembalikan tampilan penuh, gunakan 1.',
      'opacity: 50 does not mean 50%. Use opacity: 0.5. Use 1 for full visibility.',
    ),
    recap: [
      b(
        'x dan y adalah pergeseran relatif dalam piksel.',
        'x and y are relative offsets in pixels.',
      ),
      b(
        'scale: 1 dan opacity: 1 adalah ukuran serta keterlihatan penuh.',
        'scale: 1 and opacity: 1 mean full size and visibility.',
      ),
    ],
    challenge: {
      title: b('Kecilkan dan redupkan', 'Shrink and soften'),
      task: b(
        'Buat kotak berakhir dengan scale: 0.7 dan opacity: 0.5.',
        'Make the box finish at scale: 0.7 and opacity: 0.5.',
      ),
      hints: [
        b(
          'Kedua properti berada dalam objek gsap.to yang sama.',
          'Put both properties in the same gsap.to object.',
        ),
        b('Gunakan scale: 0.7, opacity: 0.5.', 'Use scale: 0.7, opacity: 0.5.'),
      ],
      rule: 'properties',
    },
    solution: examples.properties.replace('scale: 0.8,', 'scale: 0.7,\n  opacity: 0.5,'),
  }),
  lesson({
    id: 'to',
    module: 1,
    title: b('Menuju keadaan baru dengan to()', 'Move to a new state with to()'),
    description: b(
      'Tentukan tujuan dan biarkan GSAP mengisi perjalanannya.',
      'Set a destination and let GSAP fill in the journey.',
    ),
    minutes: 8,
    concept: 'gsap.to()',
    scene: 'box',
    objective: b(
      'Membuat tween menuju posisi dan durasi yang kamu tentukan.',
      'Create a tween with a chosen destination and duration.',
    ),
    model: b(
      'Tween adalah perubahan bertahap dari satu keadaan ke keadaan lain. gsap.to() membaca keadaan sekarang sebagai titik awal, lalu menganimasikan perubahan menuju nilai yang kamu tulis.',
      'A tween gradually changes one state into another. gsap.to() reads the current state as the start and animates toward the values you provide.',
    ),
    explanation: b(
      'Argumen pertama adalah target; argumen kedua adalah objek pengaturan. x menentukan tujuan, duration menentukan waktu, dan ease menentukan pola kecepatannya. Menggandakan duration membuat perjalanan lebih lama, bukan lebih jauh. Jalankan dari keadaan bersih untuk membandingkan parameter secara adil.',
      'The first argument is the target; the second is a configuration object. x sets the destination, duration sets the time, and ease shapes the speed. Doubling duration makes the journey longer in time, not distance. Start from a clean state when comparing parameters.',
    ),
    steps: [
      b(
        'Jalankan nilai awal: 180 piksel dalam 1.2 detik.',
        'Run the original: 180 pixels over 1.2 seconds.',
      ),
      b(
        'Ubah distance menjadi 240 dan duration menjadi 2.',
        'Set distance to 240 and duration to 2.',
      ),
      b(
        'Geser playhead ke 50% dan amati bahwa easing memengaruhi posisi tengah.',
        'Scrub to 50% and notice that easing affects the midpoint position.',
      ),
    ],
    mistake: b(
      'duration memakai detik, bukan milidetik. Nilai 2000 membuat animasi berlangsung lebih dari setengah jam; gunakan 2 untuk dua detik.',
      'duration uses seconds, not milliseconds. 2000 lasts more than half an hour; use 2 for two seconds.',
    ),
    recap: [
      b('to() menentukan keadaan akhir.', 'to() defines the destination.'),
      b('Jarak dan durasi adalah dua hal yang berbeda.', 'Distance and duration are independent.'),
    ],
    challenge: {
      title: b('Animasi dengan durasi lebih lama', 'A slower animation'),
      task: b(
        'Animasikan kotak agar berpindah setidaknya 240 piksel selama minimal 2 detik.',
        'Animate the box so it travels at least 240 pixels over at least 2 seconds.',
      ),
      hints: [
        b(
          'Ubah dua konstanta di bagian atas editor.',
          'Change the two constants at the top of the editor.',
        ),
        b('distance = 240 dan duration = 2.', 'distance = 240 and duration = 2.'),
      ],
      rule: 'to',
    },
    solution: examples.to.replace('180', '240').replace('1.2', '2'),
  }),
  lesson({
    id: 'from',
    module: 1,
    title: b('Muncul dari keadaan awal', 'Reveal from a starting state'),
    description: b(
      'Gunakan from() untuk animasi masuk yang alami.',
      'Use from() for a natural entrance.',
    ),
    minutes: 8,
    concept: 'gsap.from()',
    scene: 'box',
    objective: b(
      'Membuat animasi masuk dari atas dengan opacity nol.',
      'Create an entrance from above with zero opacity.',
    ),
    model: b(
      'from() membalik cara menulis tujuan: nilai yang ditulis adalah keadaan awal. Keadaan elemen sebelum tween dibuat menjadi keadaan akhirnya.',
      'from() flips how you describe the animation: the supplied values are the start. The element’s original state becomes the destination.',
    ),
    explanation: b(
      'Kotak preview secara normal terlihat dengan y: 0 dan opacity: 1. gsap.from dengan y: 70 dan opacity: 0 memulai kotak di bawah lalu mengembalikannya ke posisi normal. Nilai y negatif berarti mulai dari atas. from dapat langsung menerapkan keadaan awal saat dibuat; itu perilaku immediateRender, bukan kerusakan preview.',
      'The preview box normally has y: 0 and opacity: 1. gsap.from with y: 70 and opacity: 0 starts it below and returns it to normal. A negative y starts it above. from may apply the initial state immediately when created; this is immediateRender behavior, not a broken preview.',
    ),
    steps: [
      b('Amati animasi masuk dari bawah.', 'Watch the entrance from below.'),
      b('Ganti y: 70 menjadi y: -60.', 'Change y: 70 to y: -60.'),
      b(
        'Jalankan ulang; posisi akhirnya tetap sama.',
        'Replay; its final position stays the same.',
      ),
    ],
    mistake: b(
      'Menggunakan to dengan opacity: 0 membuat elemen menghilang. Untuk memunculkan elemen dari transparan, gunakan from dengan opacity: 0.',
      'to with opacity: 0 fades an element out. To reveal it from transparent, use from with opacity: 0.',
    ),
    recap: [
      b('from() mendefinisikan keadaan awal.', 'from() defines the initial state.'),
      b(
        'Nilai y negatif berada di atas posisi layout.',
        'A negative y is above the layout position.',
      ),
    ],
    challenge: {
      title: b('Datang dari atas', 'Arrive from above'),
      task: b(
        'Gunakan from() dengan y negatif dan opacity: 0.',
        'Use from() with a negative y and opacity: 0.',
      ),
      hints: [
        b('Pertahankan from dan opacity: 0.', 'Keep from and opacity: 0.'),
        b('Ubah y menjadi -60.', 'Set y to -60.'),
      ],
      rule: 'from',
    },
    solution: examples.from.replace('y: 70', 'y: -60'),
  }),
  lesson({
    id: 'set',
    module: 1,
    title: b('Siapkan keadaan dengan set()', 'Set the starting state'),
    description: b(
      'Atur properti secara langsung sebelum tween berjalan.',
      'Apply properties immediately before a tween.',
    ),
    minutes: 7,
    concept: 'gsap.set()',
    scene: 'box',
    objective: b(
      'Memisahkan persiapan keadaan dari animasi yang berlangsung.',
      'Separate state setup from an animated transition.',
    ),
    model: b(
      'set() seperti menata panggung sebelum pertunjukan. Properti berubah langsung tanpa menunggu waktu berlalu. Setelah itu, to() dapat melanjutkan animasi dari keadaan tersebut.',
      'set() is like arranging the stage before a performance. Properties change instantly, without waiting for time to pass. A following to() animates from that new state.',
    ),
    explanation: b(
      'gsap.set() setara dengan tween berdurasi nol untuk perubahan properti. Pada contoh, kotak dikecilkan dan diputar dahulu. Tween berikutnya mengembalikan scale dan rotation sambil menggeser posisi. Pola ini berguna saat keadaan awal perlu dinyatakan dengan jelas, tetapi jangan memanggil set berulang pada setiap frame tanpa alasan.',
      'gsap.set() is effectively a zero-duration tween for property changes. Here the box is first scaled and rotated. The next tween restores scale and rotation while moving it sideways. This pattern makes the initial state explicit; there is no need to call set repeatedly on every frame.',
    ),
    steps: [
      b(
        'Geser progres ke 0% untuk melihat keadaan yang disiapkan set().',
        'Scrub to 0% to inspect the state prepared by set().',
      ),
      b('Ubah scale pada set dari 0.7 ke 0.5.', 'Change scale in set from 0.7 to 0.5.'),
      b(
        'Jalankan dan perhatikan ukuran akhirnya kembali menjadi 1.',
        'Run and notice the final scale returns to 1.',
      ),
    ],
    mistake: b(
      'Menaruh duration pada set tidak membuat transisi. Gunakan to() jika perubahan perlu berlangsung sepanjang waktu.',
      'Adding duration to set does not create a transition. Use to() when a change should take time.',
    ),
    recap: [
      b('set() menerapkan nilai tanpa transisi.', 'set() applies values without a transition.'),
      b(
        'Keadaan awal yang eksplisit memudahkan pemulihan.',
        'An explicit starting state makes recovery easier.',
      ),
    ],
    challenge: {
      title: b('Mulai dari setengah ukuran', 'Start at half size'),
      task: b(
        'Siapkan kotak dengan gsap.set dan scale: 0.5, lalu animasikan ke ukuran penuh.',
        'Prepare the box with gsap.set and scale: 0.5, then animate it to full size.',
      ),
      hints: [
        b(
          'Ubah scale pada pemanggilan set, bukan to.',
          'Change scale in the set call rather than the to call.',
        ),
        b(
          'gsap.set(".box", { scale: 0.5, rotation: -15 });',
          'gsap.set(".box", { scale: 0.5, rotation: -15 });',
        ),
      ],
      rule: 'set',
    },
    solution: examples.set.replace('scale: 0.7', 'scale: 0.5'),
  }),
  lesson({
    id: 'easing',
    module: 2,
    title: b('Jarak sama, rasa berbeda', 'Same distance, different feeling'),
    description: b(
      'Bandingkan animasi linear dengan easing.',
      'Compare linear animation with easing.',
    ),
    minutes: 10,
    concept: 'ease',
    scene: 'box',
    objective: b(
      'Menjelaskan perbedaan linear, percepatan, perlambatan, dan overshoot.',
      'Explain linear movement, acceleration, deceleration, and overshoot.',
    ),
    model: b(
      'Easing adalah cara membagi perjalanan sepanjang waktu. Bayangkan dua kendaraan menempuh jarak dan waktu yang sama, tetapi satu melaju tetap sementara yang lain cepat lalu melambat.',
      'Easing distributes a journey over time. Imagine two vehicles covering the same distance in the same time: one moves steadily, while the other starts fast and slows down.',
    ),
    explanation: b(
      'none mempertahankan kecepatan animasi tetap. power2.out melambat menjelang akhir; power2.in mempercepat di awal; power2.inOut menggabungkan keduanya. back.out sedikit melewati titik tujuan sebelum kembali. Kotak ungu di preview memakai none sebagai pembanding. Easing mengatur perubahan posisi antar-frame, bukan titik akhir atau durasi total.',
      'none moves at constant speed. power2.out slows near the end; power2.in speeds up from the start; power2.inOut combines them. back.out briefly overshoots its destination. The purple comparison box always uses none. Easing changes intermediate positions, not the final destination or total duration.',
    ),
    steps: [
      b(
        'Jalankan saat ease bernilai none: kedua kotak berpindah dengan kecepatan yang sama.',
        'Run with ease set to none: both boxes move together.',
      ),
      b(
        'Pilih power2.out dan amati siapa yang lebih dahulu di tengah perjalanan.',
        'Choose power2.out and compare positions halfway through.',
      ),
      b(
        'Coba back.out(1.7), lalu bandingkan posisi akhir animasinya.',
        'Try back.out(1.7) and compare the finish.',
      ),
    ],
    mistake: b(
      'Easing yang kuat tidak selalu lebih baik. Hindari bounce atau elastic untuk elemen yang harus tetap mudah dibaca.',
      'Stronger easing is not always better. Avoid bounce or elastic on elements that must remain easy to read.',
    ),
    recap: [
      b('Easing membentuk kecepatan sepanjang tween.', 'Easing shapes speed throughout a tween.'),
      b(
        'Pilih karakter animasi sesuai fungsi elemen.',
        'Choose an animation style that suits the element’s purpose.',
      ),
    ],
    challenge: {
      title: b('Sedikit melewati tujuan', 'A little overshoot'),
      task: b(
        'Ubah ease kotak utama menjadi back.out(1.7). Pertahankan pembanding linear.',
        'Set the main box ease to back.out(1.7). Keep the linear comparison.',
      ),
      hints: [
        b('Ubah konstanta ease di atas editor.', 'Change the ease constant at the top.'),
        b('Gunakan string "back.out(1.7)".', 'Use the string "back.out(1.7)".'),
      ],
      rule: 'easing',
    },
    solution: examples.easing.replace('const ease = "none"', 'const ease = "back.out(1.7)"'),
  }),
  lesson({
    id: 'delay',
    module: 2,
    title: b('Beri jeda sebelum animasi dimulai', 'Add a delay before the animation starts'),
    description: b(
      'Pisahkan waktu tunggu dari durasi animasi.',
      'Separate the delay from the animation duration.',
    ),
    minutes: 6,
    concept: 'delay',
    scene: 'box',
    objective: b(
      'Menggunakan delay tanpa mengubah durasi tween.',
      'Use delay without changing the tween duration.',
    ),
    model: b(
      'delay adalah waktu sebelum keberangkatan; duration adalah lama perjalanannya. Menunggu satu detik tidak membuat perjalanannya sendiri lebih lambat.',
      'delay is the wait before departure; duration is the journey itself. Waiting one second does not make the journey slower.',
    ),
    explanation: b(
      'Contoh ini menunggu 0.5 detik sebelum menganimasikan kotak selama 1.2 detik. Animasi selesai sekitar 1.7 detik setelah pemanggilan. Jika banyak elemen perlu urutan yang saling bergantung, timeline lebih mudah dirawat daripada menumpuk banyak delay manual.',
      'This example waits 0.5 seconds before animating for 1.2 seconds. It finishes about 1.7 seconds after the call. If several elements need dependent timing, a timeline is easier to maintain than a pile of manual delays.',
    ),
    steps: [
      b('Jalankan dan amati kotak yang diam sesaat.', 'Run and observe the initial pause.'),
      b('Ubah delay menjadi 1.', 'Change delay to 1.'),
      b(
        'Biarkan duration tetap; animasinya sendiri tidak melambat.',
        'Keep duration unchanged; the movement itself does not slow down.',
      ),
    ],
    mistake: b(
      'Delay panjang dapat terlihat seperti tombol yang tidak merespons. Pakai jeda secukupnya dan beri konteks pada pengguna.',
      'A long delay can feel like an unresponsive button. Keep waits purposeful and understandable.',
    ),
    recap: [
      b('delay terjadi sebelum animasi dimulai.', 'delay comes before movement.'),
      b(
        'Waktu tunggu dan durasi animasi berbeda.',
        'Waiting time and animation duration are different.',
      ),
    ],
    challenge: {
      title: b('Tunggu satu detik', 'Wait one second'),
      task: b('Beri tween delay minimal 1 detik.', 'Give the tween a delay of at least 1 second.'),
      hints: [
        b('Cari properti delay dalam gsap.to().', 'Find the delay property inside gsap.to().'),
        b('Ganti delay: 0.5 dengan delay: 1.', 'Replace delay: 0.5 with delay: 1.'),
      ],
      rule: 'delay',
    },
    solution: examples.delay.replace('delay: 0.5', 'delay: 1'),
  }),
  lesson({
    id: 'repeat',
    module: 2,
    title: b('Ulangi dan kembali dengan yoyo', 'Repeat and return with yoyo'),
    description: b(
      'Buat pengulangan yang bisa dikendalikan.',
      'Create a controlled repeating animation.',
    ),
    minutes: 8,
    concept: 'repeat · yoyo',
    scene: 'box',
    objective: b(
      'Membuat tiga putaran dengan arah bergantian.',
      'Create three iterations with alternating directions.',
    ),
    model: b(
      'repeat menghitung pengulangan setelah putaran pertama. repeat: 2 berarti total tiga putaran. yoyo: true membalik arah setiap pengulangan, seperti perjalanan pergi dan pulang.',
      'repeat counts additional iterations after the first. repeat: 2 means three total iterations. yoyo: true reverses direction on each repeat, like a journey out and back.',
    ),
    explanation: b(
      'Tanpa yoyo, tween kembali ke titik awal setiap kali mengulang. Dengan yoyo, putaran kedua menganimasikan elemen dari akhir ke awal. repeat: -1 berarti terus-menerus; gunakan dengan hati-hati dan selalu beri tombol berhenti. Untuk latihan ini gunakan jumlah terbatas agar hasil mudah dibandingkan.',
      'Without yoyo, a tween jumps back to its start on each repeat. With yoyo, the second iteration travels backward. repeat: -1 repeats indefinitely; use it carefully and always provide a stop control. Use a finite count here so results are easy to compare.',
    ),
    steps: [
      b('Jalankan repeat: 1 dan hitung dua perjalanan.', 'Run repeat: 1 and count two journeys.'),
      b('Ubah repeat menjadi 2.', 'Set repeat to 2.'),
      b(
        'Bandingkan yoyo true dan false sebelum mengembalikannya ke true.',
        'Compare yoyo true and false, then restore true.',
      ),
    ],
    mistake: b(
      'repeat: 3 bukan tiga putaran total, melainkan empat. Hitung putaran awal secara terpisah.',
      'repeat: 3 means four total iterations, not three. Count the initial run separately.',
    ),
    recap: [
      b('Total putaran = 1 + repeat.', 'Total iterations = 1 + repeat.'),
      b('yoyo membalik arah pada pengulangan berikutnya.', 'yoyo reverses the next iteration.'),
    ],
    challenge: {
      title: b('Tiga putaran, dua arah', 'Three iterations, two directions'),
      task: b('Gunakan repeat: 2 dan yoyo: true.', 'Use repeat: 2 and yoyo: true.'),
      hints: [
        b('Ubah repeat, bukan duration.', 'Change repeat rather than duration.'),
        b('repeat: 2, yoyo: true.', 'repeat: 2, yoyo: true.'),
      ],
      rule: 'repeat',
    },
    solution: examples.repeat.replace('repeat: 1', 'repeat: 2'),
  }),
  lesson({
    id: 'timeline',
    module: 3,
    title: b('Satu timeline, beberapa animasi', 'One timeline, several animations'),
    description: b('Susun tween dalam urutan yang jelas.', 'Sequence tweens in a clear order.'),
    minutes: 10,
    concept: 'gsap.timeline()',
    scene: 'timeline',
    objective: b(
      'Menyusun tiga tween berurutan dan membaca playhead-nya.',
      'Sequence three tweens and read their playhead.',
    ),
    model: b(
      'Timeline adalah daftar adegan yang punya satu jam bersama. Secara default, tween berikutnya dimulai setelah tween sebelumnya selesai. Playhead menunjukkan posisi waktu di dalam cerita itu.',
      'A timeline is a list of scenes sharing one clock. By default, the next tween starts after the previous one finishes. A playhead shows the current position in that story.',
    ),
    explanation: b(
      'gsap.timeline() membuat wadah. Rangkaian .to() menambahkan tween ke wadah tersebut. defaults mengurangi pengulangan pengaturan, tetapi setiap tween tetap boleh punya nilai sendiri. Visualisasi di bawah preview membaca waktu mulai dan durasi tween yang benar-benar dibuat oleh kodemu, sehingga perubahan urutan terlihat di sana.',
      'gsap.timeline() creates a container. Chained .to() calls add tweens. defaults avoids repeating shared settings, but individual tweens can override them. The visualizer reads actual tween start times and durations from your code, so timing edits appear in its tracks.',
    ),
    steps: [
      b(
        'Jalankan dan amati animasi kotak yang berjalan satu per satu.',
        'Run and watch the boxes animate one at a time.',
      ),
      b(
        'Geser playhead melewati batas setiap track.',
        'Scrub the playhead across each track boundary.',
      ),
      b(
        'Tambahkan rotation: 180 pada tween kotak ketiga.',
        'Add rotation: 180 to the third box tween.',
      ),
    ],
    mistake: b(
      'Tiga gsap.to() terpisah berjalan bersamaan jika dipanggil berurutan tanpa delay. Gunakan timeline untuk membuat ketergantungan urutan.',
      'Three separate gsap.to() calls start together when called consecutively without delays. Use a timeline to express sequence.',
    ),
    recap: [
      b(
        'Timeline mengelompokkan dan mengurutkan tween.',
        'A timeline groups and sequences tweens.',
      ),
      b('defaults dapat ditimpa per tween.', 'Individual tweens can override defaults.'),
    ],
    challenge: {
      title: b('Akhiri dengan putaran', 'Finish with a turn'),
      task: b(
        'Pertahankan tiga tween berurutan dan putar .item-3 setidaknya 180 derajat.',
        'Keep three sequential tweens and rotate .item-3 by at least 180 degrees.',
      ),
      hints: [
        b('Tambahkan rotation pada objek tween ketiga.', 'Add rotation to the third tween object.'),
        b(
          '.to(".item-3", { x: distance, rotation: 180 });',
          '.to(".item-3", { x: distance, rotation: 180 });',
        ),
      ],
      rule: 'timeline',
    },
    solution: examples.timeline.replace(
      '.to(".item-3", { x: distance })',
      '.to(".item-3", { x: distance, rotation: 180 })',
    ),
  }),
  lesson({
    id: 'overlap',
    module: 3,
    title: b('Tumpuk beberapa animasi', 'Let animations overlap'),
    description: b(
      'Kenali position parameter dan waktu relatif.',
      'Explore position parameters and relative timing.',
    ),
    minutes: 10,
    concept: 'position · overlap',
    scene: 'timeline',
    objective: b(
      'Membuat tween kedua mulai sebelum tween pertama selesai.',
      'Start the second tween before the first finishes.',
    ),
    model: b(
      'Position parameter adalah petunjuk tempat menaruh adegan pada jam timeline. "-=0.5" memajukan awal tween setengah detik dari ujung timeline saat ini. "<" menyamakan awal dengan tween yang terakhir ditambahkan.',
      'A position parameter places a scene on the timeline clock. "-=0.5" starts half a second before the current timeline end. "<" aligns with the start of the most recently added tween.',
    ),
    explanation: b(
      'Position berada sebagai argumen ketiga .to(target, vars, position), bukan di dalam objek vars. Overlap menyambungkan beberapa animasi dan mempersingkat keseluruhan rangkaian. Visual track membantu membedakan awal bersamaan, akhir berurutan, dan tumpang tindih sebagian.',
      'Position is the third argument in .to(target, vars, position), not a field inside vars. Overlap connects animations and shortens the overall sequence. Tracks help distinguish synchronized starts, sequential finishes, and partial overlap.',
    ),
    steps: [
      b(
        'Amati tween kedua dimulai setengah detik lebih awal.',
        'Notice the second tween starts half a second early.',
      ),
      b('Ubah "-=0.5" menjadi "-=0.8".', 'Change "-=0.5" to "-=0.8".'),
      b(
        'Jalankan dan cocokkan animasi dengan track yang bertumpuk.',
        'Run and match the motion to the overlapping tracks.',
      ),
    ],
    mistake: b(
      '"<" merujuk awal tween terbaru, bukan selalu awal seluruh timeline. Gunakan angka 0 untuk awal timeline.',
      '"<" refers to the latest tween’s start, not always the start of the entire timeline. Use 0 for the timeline start.',
    ),
    recap: [
      b(
        'Argumen ketiga mengatur penempatan waktu.',
        'The third argument controls placement in time.',
      ),
      b(
        'Overlap yang lebih besar membuat adegan lebih bersamaan.',
        'Larger overlap makes scenes more simultaneous.',
      ),
    ],
    challenge: {
      title: b('Sambung lebih rapat', 'Connect the movements more closely'),
      task: b(
        'Buat tween kedua overlap minimal 0.7 detik dengan tween pertama.',
        'Overlap the second tween with the first by at least 0.7 seconds.',
      ),
      hints: [
        b(
          'Ubah nilai negatif relatif pada tween kedua.',
          'Edit the negative relative position on the second tween.',
        ),
        b('Gunakan "-=0.8".', 'Use "-=0.8".'),
      ],
      rule: 'overlap',
    },
    solution: examples.overlap.replace('-=0.5', '-=0.8'),
  }),
  lesson({
    id: 'labels',
    module: 3,
    title: b('Beri nama pada momen penting', 'Name important moments'),
    description: b(
      'Gunakan label agar timeline lebih mudah dibaca.',
      'Use labels to make timelines readable.',
    ),
    minutes: 8,
    concept: 'addLabel()',
    scene: 'timeline',
    objective: b(
      'Menambahkan label dan menjadwalkan tween relatif terhadapnya.',
      'Add a label and schedule tweens relative to it.',
    ),
    model: b(
      'Label adalah penanda waktu dengan nama, seperti bab di sebuah video. Label tidak menjalankan animasi dengan sendirinya; tween dapat mengacu pada waktu yang ditandai.',
      'A label is a named timestamp, like a chapter in a video. It does not animate anything itself; tweens can use its position.',
    ),
    explanation: b(
      'addLabel("intro") menyimpan waktu ujung timeline saat ini jika posisi tidak ditentukan. "intro+=0.3" berarti 0.3 detik setelah label intro. Penamaan membantu ketika susunan berubah: kamu dapat memindahkan satu momen penting tanpa menghitung ulang semua delay.',
      'addLabel("intro") stores the current timeline end when no position is given. "intro+=0.3" means 0.3 seconds after that label. Names help when the sequence changes: move a meaningful moment without recalculating every delay.',
    ),
    steps: [
      b(
        'Temukan label intro dan outro pada visualisasi.',
        'Find intro and outro on the visualizer.',
      ),
      b('Ganti semua nama intro menjadi reveal.', 'Rename every intro reference to reveal.'),
      b(
        'Amati animasinya tetap sama, meski nama momennya berubah.',
        'Notice the animation stays the same while the moment gets a new name.',
      ),
    ],
    mistake: b(
      'Salah ketik nama label dapat membuat label baru pada posisi yang tidak dimaksud. Jaga ejaan pada deklarasi dan referensinya.',
      'A misspelled label can create a new label at an unintended position. Keep declarations and references consistent.',
    ),
    recap: [
      b('Label menamai waktu, bukan elemen.', 'Labels name times rather than elements.'),
      b(
        'Nama yang bermakna membuat timeline lebih mudah dirawat.',
        'Meaningful names make timelines easier to maintain.',
      ),
    ],
    challenge: {
      title: b('Tandai momen reveal', 'Mark the reveal moment'),
      task: b(
        'Ganti label intro menjadi reveal dan gunakan reveal untuk dua tween pertama.',
        'Rename intro to reveal and use reveal for the first two tweens.',
      ),
      hints: [
        b(
          'Ganti addLabel dan dua position parameter yang memakai intro.',
          'Change addLabel and the two positions referencing intro.',
        ),
        b('Gunakan "reveal" dan "reveal+=0.3".', 'Use "reveal" and "reveal+=0.3".'),
      ],
      rule: 'labels',
    },
    solution: examples.labels.replaceAll('intro', 'reveal'),
  }),
  lesson({
    id: 'stagger',
    module: 3,
    title: b('Bangun ritme dengan stagger', 'Build rhythm with stagger'),
    description: b(
      'Mulai animasi kelompok dengan selisih waktu.',
      'Offset the starts of a group of animations.',
    ),
    minutes: 9,
    concept: 'stagger',
    scene: 'items',
    objective: b(
      'Mengatur jeda antarelemen tanpa menulis tween satu per satu.',
      'Offset elements without writing a separate tween for each.',
    ),
    model: b(
      'Stagger seperti orang-orang berangkat berurutan dari halte. Mereka menjalankan animasi yang sama, tetapi memulainya pada waktu berbeda. Nilai stagger adalah selisih waktu antarawal, bukan total durasi kelompok.',
      'Stagger is like people leaving a stop one after another. They follow the same path but start at different times. stagger is the gap between starts, not the group’s total duration.',
    ),
    explanation: b(
      'Dengan tiga elemen, duration 1.2 dan stagger 0.3, awalnya berada di detik 0, 0.3, dan 0.6. Elemen terakhir selesai pada 1.8 detik. Target yang hanya cocok dengan satu elemen tidak akan memperlihatkan stagger. Bentuk objek seperti { each: 0.3, from: "center" } dapat mengubah arah urutan.',
      'With three elements, duration 1.2 and stagger 0.3, starts happen at 0, 0.3, and 0.6 seconds. The last finishes at 1.8 seconds. A selector matching only one element cannot show a stagger. The object form, such as { each: 0.3, from: "center" }, can change the order.',
    ),
    steps: [
      b(
        'Jalankan stagger 0.15 dan amati selisih munculnya kotak.',
        'Run stagger 0.15 and watch the entrance offsets.',
      ),
      b('Ubah stagger menjadi 0.3.', 'Change stagger to 0.3.'),
      b(
        'Bandingkan dengan stagger: 0; semua elemen kini bersamaan.',
        'Compare with stagger: 0; all elements now start together.',
      ),
    ],
    mistake: b(
      'Stagger terlalu panjang membuat kelompok terasa lambat. Sesuaikan jarak waktu dengan jumlah elemen dan tujuan umpan balik.',
      'A long stagger can make a group feel sluggish. Match the gap to the number of elements and the purpose of the feedback.',
    ),
    recap: [
      b('stagger mengatur selisih awal antartarget.', 'stagger offsets the start of each target.'),
      b(
        'Durasi kelompok juga bergantung pada jumlah elemen.',
        'Group duration also depends on the number of elements.',
      ),
    ],
    challenge: {
      title: b('Beri setiap kotak ruang waktu', 'Give each box its moment'),
      task: b(
        'Gunakan stagger minimal 0.3 detik pada ketiga .item.',
        'Use a stagger of at least 0.3 seconds across all three .item elements.',
      ),
      hints: [
        b('Pertahankan target .item.', 'Keep the .item target.'),
        b('Ganti stagger: 0.15 menjadi stagger: 0.3.', 'Change stagger: 0.15 to stagger: 0.3.'),
      ],
      rule: 'stagger',
    },
    solution: examples.stagger.replace('stagger: 0.15', 'stagger: 0.3'),
  }),
  lesson({
    id: 'click',
    module: 4,
    title: b('Jalankan animasi saat diklik', 'Run an animation on click'),
    description: b(
      'Hubungkan event dengan kontrol animasi.',
      'Connect events to animation controls.',
    ),
    minutes: 10,
    concept: 'click · restart()',
    scene: 'interaction',
    objective: b(
      'Menyiapkan tween yang dijalankan ulang oleh tombol.',
      'Prepare a tween that a button can restart.',
    ),
    model: b(
      'Event adalah kabar bahwa pengguna melakukan sesuatu. Tween dapat disiapkan dalam keadaan paused, lalu menunggu kabar klik untuk memulai animasi.',
      'An event tells you that a user did something. A tween can be created paused and wait for a click before it plays.',
    ),
    explanation: b(
      'paused: true mencegah animasi berjalan saat dibuat. addEventListener memasang respons pada tombol. restart() kembali ke awal lalu memutar, sedangkan play() melanjutkan dari posisi sekarang. Tombol HTML juga bisa diaktifkan dengan Enter atau Space, sehingga tidak memerlukan interaksi mouse saja.',
      'paused: true prevents playback on creation. addEventListener attaches a response to the button. restart() returns to the beginning and plays, while play() continues from the current position. A native HTML button also works with Enter or Space, making it usable without a mouse.',
    ),
    steps: [
      b(
        'Jalankan kode untuk memasang event, lalu klik tombol di dalam preview.',
        'Run to install the event, then click the button inside the preview.',
      ),
      b('Ubah distance menjadi 240.', 'Set distance to 240.'),
      b(
        'Jalankan kode terbaru dan klik tombol dua kali untuk melihat restart.',
        'Run the edited code and click twice to observe restart.',
      ),
    ],
    mistake: b(
      'addEventListener("click", tween.restart()) memanggil fungsi saat dipasang. Bungkus dalam () => tween.restart() agar menunggu klik.',
      'addEventListener("click", tween.restart()) invokes the function immediately. Wrap it in () => tween.restart() to wait for a click.',
    ),
    recap: [
      b(
        'paused menyiapkan animasi tanpa memutarnya.',
        'paused prepares an animation without playback.',
      ),
      b('restart mengulang dari awal; play melanjutkan.', 'restart starts over; play continues.'),
    ],
    challenge: {
      title: b('Klik untuk pergi lebih jauh', 'Click to go farther'),
      task: b(
        'Ubah jarak menjadi minimal 240 piksel, jalankan, lalu aktifkan tombol di dalam preview.',
        'Set a distance of at least 240 pixels, run, then activate the preview button.',
      ),
      hints: [
        b(
          'Ubah distance lalu tekan Jalankan sebelum mencoba tombol preview.',
          'Change distance and press Run before using the preview button.',
        ),
        b(
          'Tombol preview bernama Animasikan kotak.',
          'The preview button is called Animate the box.',
        ),
      ],
      rule: 'click',
    },
    solution: examples.click.replace('180', '240'),
  }),
  lesson({
    id: 'hover',
    module: 4,
    title: b('Hover yang bisa kembali', 'Hover that returns gracefully'),
    description: b(
      'Pasangkan play, reverse, dan fokus keyboard.',
      'Pair play, reverse, and keyboard focus.',
    ),
    minutes: 10,
    concept: 'play() · reverse()',
    scene: 'interaction',
    objective: b(
      'Membuat umpan balik hover yang dapat dipulihkan dan diakses dengan keyboard.',
      'Build reversible hover feedback that also works with a keyboard.',
    ),
    model: b(
      'Satu tween bisa berjalan maju dan mundur. Memakai tween yang sama mencegah tumpukan animasi baru setiap kali pointer masuk dan keluar.',
      'One tween can play forward and backward. Reusing it avoids creating a pile of animations whenever the pointer enters and leaves.',
    ),
    explanation: b(
      'pointerenter memutar tween, pointerleave membalikkannya. focus dan blur memberi perilaku yang sama saat menggunakan Tab. Pada perangkat sentuh, tombol fokus di preview dapat memfokuskan kotak. Gunakan durasi singkat untuk respons antarmuka, dan pastikan keadaan akhir saat keluar kembali seperti semula.',
      'pointerenter plays the tween and pointerleave reverses it. focus and blur provide the same behavior with Tab. On touch devices, the preview focus button can focus the box. Keep interface responses brief and make sure leaving returns the element to its original state.',
    ),
    steps: [
      b(
        'Jalankan, arahkan pointer ke kotak, lalu keluarkan.',
        'Run, hover the box, then move away.',
      ),
      b(
        'Fokuskan kotak dengan keyboard atau tombol fokus.',
        'Focus the box with the keyboard or focus button.',
      ),
      b(
        'Ubah scale ke 1.35; pertahankan reverse saat keluar.',
        'Change scale to 1.35; keep reverse on exit.',
      ),
    ],
    mistake: b(
      'Hover saja tidak tersedia pada semua perangkat. Sediakan fokus keyboard dan jangan menyembunyikan informasi penting di balik hover.',
      'Hover is not available on every device. Support keyboard focus and never hide essential information behind hover.',
    ),
    recap: [
      b('Satu tween dapat digunakan kembali.', 'One tween can be reused.'),
      b(
        'Pasangkan hover dengan focus, dan keluar dengan blur.',
        'Pair hover with focus, and exit with blur.',
      ),
    ],
    challenge: {
      title: b('Respons yang lebih jelas', 'A clearer response'),
      task: b(
        'Ubah scale menjadi minimal 1.35, jalankan, lalu fokuskan atau hover kotak.',
        'Set scale to at least 1.35, run, then focus or hover the box.',
      ),
      hints: [
        b(
          'Ubah scale pada tween, bukan CSS preview.',
          'Edit scale in the tween rather than the preview CSS.',
        ),
        b(
          'Gunakan scale: 1.35 dan coba tombol Fokus kotak.',
          'Use scale: 1.35 and try the Focus box button.',
        ),
      ],
      rule: 'hover',
    },
    solution: examples.hover.replace('scale: 1.2', 'scale: 1.35'),
  }),
  lesson({
    id: 'trigger',
    module: 5,
    title: b('Scroll sebagai pemicu', 'Scroll as a trigger'),
    description: b(
      'Jalankan animasi ketika elemen melewati batas.',
      'Start an animation when an element crosses a boundary.',
    ),
    minutes: 12,
    concept: 'ScrollTrigger · start',
    scene: 'scroll',
    objective: b(
      'Mengatur area scroll, trigger, dan posisi start tanpa mengunci halaman.',
      'Configure a scroll area, a trigger, and a start point without locking the page.',
    ),
    model: b(
      'ScrollTrigger mengamati pertemuan dua posisi. "top center" berarti bagian atas trigger bertemu tengah area scroll. Tanpa scrub, pertemuan itu memicu tween yang kemudian berjalan dengan waktunya sendiri.',
      'ScrollTrigger watches two positions meet. "top center" means the trigger’s top meets the scroller’s center. Without scrub, that meeting starts a tween that then runs on its own clock.',
    ),
    explanation: b(
      'trigger adalah elemen yang diamati; scroller adalah area yang digulir. Di sini scroller menunjuk panel preview, bukan halaman utama. start dan end menetapkan rentang aktif. toggleActions mengatur respons saat masuk, keluar, masuk kembali dari bawah, dan keluar kembali ke atas. Penanda membantu melihat batasnya.',
      'trigger is the watched element; scroller is the scrollable area. Here the scroller is the preview panel, not the main page. start and end define the active range. toggleActions controls entering, leaving, entering back, and leaving back. Markers reveal those boundaries.',
    ),
    steps: [
      b('Jalankan dan scroll di dalam panel preview.', 'Run and scroll inside the preview panel.'),
      b(
        'Gunakan slider scroll jika gesture panel terasa sulit.',
        'Use the scroll slider if nested scrolling feels difficult.',
      ),
      b(
        'Ubah start menjadi "top 75%" agar animasi dimulai lebih awal.',
        'Set start to "top 75%" so the animation begins earlier.',
      ),
    ],
    mistake: b(
      'Lupa menentukan scroller akan membuat ScrollTrigger mengamati halaman utama. Pertahankan scroller: ".scroll-scene" untuk demo ini.',
      'Without scroller, ScrollTrigger watches the main page. Keep scroller: ".scroll-scene" in this demo.',
    ),
    recap: [
      b(
        'Trigger biasa memulai tween berbasis waktu.',
        'A regular trigger starts a time-based tween.',
      ),
      b(
        'Panel preview dan halaman utama punya scroll berbeda.',
        'The preview and the main page have separate scroll areas.',
      ),
    ],
    challenge: {
      title: b('Mulai sedikit lebih awal', 'Start a little earlier'),
      task: b(
        'Gunakan start: "top 75%" dan pertahankan scrub: false.',
        'Use start: "top 75%" and keep scrub: false.',
      ),
      hints: [
        b(
          'Ubah properti start dalam objek scrollTrigger.',
          'Edit start in the scrollTrigger object.',
        ),
        b(
          '75% berada lebih rendah dari center sehingga trigger lebih cepat bertemu batas.',
          '75% is below center, so the trigger reaches the boundary sooner.',
        ),
      ],
      rule: 'trigger',
    },
    solution: examples.trigger.replace('top center', 'top 75%'),
  }),
  lesson({
    id: 'scrub',
    module: 5,
    title: b('Scroll sebagai playhead', 'Scroll as a playhead'),
    description: b(
      'Hubungkan posisi scroll dengan progres animasi.',
      'Link scroll position to animation progress.',
    ),
    minutes: 12,
    concept: 'scrub · progress',
    scene: 'scroll',
    objective: b(
      'Membedakan animasi yang dipicu scroll dan animasi yang mengikuti scroll.',
      'Distinguish scroll-triggered animation from scroll-linked animation.',
    ),
    model: b(
      'Dengan scrub, posisi scroll menjadi playhead. Setengah perjalanan antara start dan end berarti setengah progres tween. Berhenti scroll berarti berhenti pada keadaan itu.',
      'With scrub, scroll position becomes the playhead. Halfway between start and end means halfway through the tween. Stop scrolling and the animation stays at that state.',
    ),
    explanation: b(
      'scrub: true menghubungkan progres langsung. scrub: 1 memberi jeda pengejaran sekitar satu detik agar terasa lebih halus. ease: "none" memudahkan membaca hubungan scroll dan posisi secara linear. duration tetap berguna untuk proporsi antar-tween pada timeline, tetapi rentang start–end menentukan jarak scroll.',
      'scrub: true links progress directly. scrub: 1 adds about a second of catch-up smoothing. ease: "none" makes the relationship between scroll and position linear. duration still matters for relative tween lengths in a timeline, while the start–end range controls the scroll distance.',
    ),
    steps: [
      b(
        'Jalankan, lalu geser kontrol scroll ke 25%, 50%, dan 75%.',
        'Run and move the scroll control to 25%, 50%, and 75%.',
      ),
      b(
        'Bandingkan mode Trigger dengan Scrub pada kontrol.',
        'Compare Trigger and Scrub modes using the control.',
      ),
      b(
        'Kembalikan Scrub, tambahkan rotation: 180, lalu ulangi.',
        'Restore Scrub, add rotation: 180, and try again.',
      ),
    ],
    mistake: b(
      'Menggandakan duration tween tunggal tidak menggandakan jarak scroll. Ubah end jika ingin rentang scroll lebih panjang.',
      'Doubling a single tween’s duration does not double its scroll distance. Change end for a longer scroll range.',
    ),
    recap: [
      b('scrub menghubungkan scroll dan progres.', 'scrub connects scrolling and progress.'),
      b(
        'start–end menentukan rentang perjalanan scroll.',
        'start–end defines the scroll travel range.',
      ),
    ],
    challenge: {
      title: b('Putaran yang mengikuti scroll', 'A scroll-linked turn'),
      task: b(
        'Pertahankan scrub aktif dan tambahkan rotation: 180 atau lebih pada tween.',
        'Keep scrub active and add rotation of at least 180 to the tween.',
      ),
      hints: [
        b(
          'Tambahkan rotation sejajar dengan x, bukan di dalam scrollTrigger.',
          'Add rotation next to x, not inside scrollTrigger.',
        ),
        b('Gunakan x: distance, rotation: 180.', 'Use x: distance, rotation: 180.'),
      ],
      rule: 'scrub',
    },
    solution: examples.scrub.replace(
      'x: distance, duration',
      'x: distance, rotation: 180, duration',
    ),
  }),
  lesson({
    id: 'pin',
    module: 5,
    title: b('Tahan elemen sejenak dengan pin', 'Hold an element with pin'),
    description: b(
      'Beri ruang untuk cerita tanpa mengambil alih scroll.',
      'Give a story space without taking over scrolling.',
    ),
    minutes: 12,
    concept: 'pin · end',
    scene: 'scroll',
    objective: b(
      'Memakai pin dalam rentang terbatas dan memahami ruang tambahannya.',
      'Use pin over a limited range and understand its added space.',
    ),
    model: b(
      'Pin menahan elemen di tempat selama rentang aktif. Scroll tetap berjalan, tetapi satu bagian menunggu sementara progres animasinya terus berubah.',
      'Pin holds an element in place during the active range. Scrolling continues, but one section stays while its animation progresses.',
    ),
    explanation: b(
      'Contoh mem-pin .pin-area di dalam panel. ScrollTrigger menambahkan spacer agar layout tetap memiliki ruang. end: "+=400" berarti rentang 400 piksel setelah start. Pin panjang pada layar kecil dapat menyulitkan akses; gunakan seperlunya dan sediakan slider sebagai alternatif untuk memeriksa hasil.',
      'This example pins .pin-area inside the panel. ScrollTrigger adds a spacer to preserve layout space. end: "+=400" means a 400-pixel range after start. Long pinned sections can hinder small-screen navigation; keep them purposeful and provide a slider to inspect the result.',
    ),
    steps: [
      b('Jalankan dengan Pin aktif dan gulir perlahan.', 'Run with Pin enabled and scroll slowly.'),
      b('Bandingkan keadaan saat Pin dimatikan.', 'Compare with Pin disabled.'),
      b('Aktifkan lagi dan ubah end menjadi "+=400".', 'Re-enable it and change end to "+=400".'),
    ],
    mistake: b(
      'Jangan mem-pin elemen yang sama dengan elemen yang digeser jauh. Gunakan pembungkus sebagai pin, lalu animasikan anaknya.',
      'Avoid pinning the same element that travels a long distance. Pin a wrapper and animate its child.',
    ),
    recap: [
      b(
        'Pin menahan elemen selama rentang aktif.',
        'Pin holds an element during the active range.',
      ),
      b('Sediakan ruang dan cara navigasi alternatif.', 'Provide space and alternative controls.'),
    ],
    challenge: {
      title: b('Beri cerita ruang lebih panjang', 'Give the story more room'),
      task: b(
        'Aktifkan pin dan ubah end menjadi "+=400" atau lebih.',
        'Enable pin and set end to "+=400" or longer.',
      ),
      hints: [
        b('Pertahankan konstanta pin = true.', 'Keep the pin constant set to true.'),
        b('Ganti end: "+=260" menjadi end: "+=400".', 'Change end: "+=260" to end: "+=400".'),
      ],
      rule: 'pin',
    },
    solution: examples.pin.replace('+=260', '+=400'),
  }),
  lesson({
    id: 'project',
    module: 6,
    title: b('Mini proyek: sebuah motion studio', 'Mini project: a motion studio'),
    description: b(
      'Gabungkan tween, urutan, interaksi, dan scroll.',
      'Combine tweens, sequences, interaction, and scrolling.',
    ),
    minutes: 25,
    concept: 'mini project',
    scene: 'project',
    objective: b(
      'Membuat satu bagian halaman interaktif dengan pola animasi yang kamu pahami.',
      'Build an interactive page section with animation patterns you understand.',
    ),
    model: b(
      'Proyek kecil adalah beberapa keputusan sederhana yang saling terhubung. Mulai dari struktur yang terbaca, susun animasi masuk, tambahkan kontrol ulang, lalu gunakan scroll hanya pada bagian yang membutuhkannya.',
      'A small project is a set of connected simple decisions. Start with readable structure, sequence the entrance, add replay, then use scrolling only where it serves the section.',
    ),
    explanation: b(
      'Preview menyediakan judul, tiga kartu, tombol ulang, dan bentuk yang berputar saat scroll. Timeline menangani animasi masuk. Tombol memakai restart untuk mengulangi urutan. ScrollTrigger mengendalikan orb pada bagian bawah secara terpisah. Pendekatan visualmu boleh berbeda; perhatikan keterbacaan, kontrol, dan pemulihan keadaan lebih dulu.',
      'The preview provides a heading, three cards, a replay button, and a shape that turns on scroll. A timeline handles the entrance. The button restarts the sequence. ScrollTrigger controls the lower orb independently. Your visual approach can differ; prioritize readability, control, and recoverable states.',
    ),
    steps: [
      b(
        'Jalankan dan identifikasi tiga bagian timeline masuk.',
        'Run and identify the three entrance sections.',
      ),
      b(
        'Tambahkan scale: 0.8 pada animasi masuk .project-card.',
        'Add scale: 0.8 to the .project-card entrance.',
      ),
      b(
        'Ulangi lewat tombol preview, lalu scroll untuk mencoba orb.',
        'Replay with the preview button, then scroll to try the orb.',
      ),
      b(
        'Aktifkan Kurangi animasi dan pastikan informasi tetap terbaca.',
        'Try reduced motion and confirm the information remains readable.',
      ),
    ],
    mistake: b(
      'Menambah semua efek sekaligus menyulitkan menemukan kesalahan. Ubah satu konsep, jalankan, lalu lanjutkan.',
      'Adding every effect at once makes problems hard to locate. Change one concept, run it, then continue.',
    ),
    recap: [
      b(
        'Pisahkan animasi masuk, interaksi, dan scroll sesuai tanggung jawabnya.',
        'Separate entrance, interaction, and scroll responsibilities.',
      ),
      b(
        'Animasi yang baik memberi konteks dan bisa dihentikan.',
        'Useful animation provides context and can be stopped.',
      ),
    ],
    challenge: {
      title: b('Beri kartu karakter sendiri', 'Give the cards your own character'),
      task: b(
        'Tambahkan scale: 0.8 pada from() .project-card. Pertahankan timeline, kontrol ulang, dan ScrollTrigger, lalu aktifkan tombol preview.',
        'Add scale: 0.8 to the .project-card from() tween. Keep the timeline, replay control, and ScrollTrigger, then activate the preview button.',
      ),
      hints: [
        b('Cari tween .from(".project-card", ...).', 'Find the .from(".project-card", ...) tween.'),
        b(
          'Tambahkan scale: 0.8 sejajar dengan y dan opacity.',
          'Add scale: 0.8 alongside y and opacity.',
        ),
      ],
      rule: 'project',
    },
    solution: examples.project.replace(
      '{ y: 50, opacity: 0, stagger',
      '{ y: 50, opacity: 0, scale: 0.8, stagger',
    ),
  }),
]
const lessonOrder = [
  'gsap-foundations',
  'animation-blueprint',
  'orientation',
  'coordinates',
  'selectors',
  'properties',
  'to',
  'from',
  'set',
  'from-to',
  'relative',
  'origin',
  'auto-alpha',
  'easing',
  'delay',
  'repeat',
  'repeat-delay',
  'keyframes',
  'timeline',
  'overlap',
  'labels',
  'stagger',
  'defaults',
  'stagger-order',
  'speed',
  'click',
  'hover',
  'callbacks',
  'overwrite',
  'utils',
  'trigger',
  'scrub',
  'pin',
  'scroll-timeline',
  'svg-attributes',
  'svg-stroke',
  'motion-path',
  'context',
  'match-media',
  'reduced-motion',
  'project-menu',
  'project',
]
const lessonMap = new Map<string, Lesson>(
  [...introLessons, ...foundationLessons, ...expandedLessons].map(item => [item.id, item]),
)
export const lessons: Lesson[] = lessonOrder.map(id => {
  const item = lessonMap.get(id)
  if (!item) throw new Error(`Missing curriculum lesson: ${id}`)
  const lesson = item.id === 'project' ? { ...item, module: 8 } : item
  return lesson
})
export const getLesson = (id: string | undefined) => lessons.find(l => l.id === id)
export const getModuleLessons = (number: number) => lessons.filter(l => l.module === number)
export const practiceLessons = lessons.filter((l): l is PracticeLesson => l.format !== 'concept')
export const getPracticeLesson = (id: string) => practiceLessons.find(l => l.id === id)
export const nextRecommended = (completed: string[], lastLesson?: string | null) => {
  const resume = getLesson(lastLesson ?? undefined)
  return resume && !completed.includes(resume.id)
    ? resume
    : (lessons.find(l => !completed.includes(l.id)) ?? lessons[0])
}
export const totalMinutes = lessons.reduce((sum, l) => sum + l.minutes, 0)
