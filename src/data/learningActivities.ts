import { b } from './types'
import type { Copy, LearningActivity, PracticeLesson } from './types'

type Pair = [string, string]
type Blueprint = Omit<LearningActivity, 'variation'> & {
  change: [string, string]
  variantTitle: Copy
  observation: Copy
}
function a(
  before: string[],
  question: Pair,
  choices: Pair[],
  answer: number,
  explanation: Pair,
  lines: [string, string, string][],
  change: [string, string],
  title: Pair,
  observation: Pair,
): Blueprint {
  return {
    prerequisites: before,
    question: b(...question),
    choices: choices.map(p => b(...p)),
    answer,
    explanation: b(...explanation),
    walkthrough: lines.map(([match, id, en]) => ({ match, explanation: b(id, en) })),
    change,
    variantTitle: b(...title),
    observation: b(...observation),
  }
}

const activities: Record<string, Blueprint> = {
  orientation: a(
    ['animation-blueprint'],
    ['Apa yang terjadi kalau duration diperbesar?', 'What happens when duration increases?'],
    [
      ['Kotak lebih jauh', 'The box goes farther'],
      ['Animasi lebih lama', 'Playback lasts longer'],
      ['Kotak membesar', 'The box grows'],
    ],
    1,
    [
      'duration mengatur waktu dalam detik. Jarak tetap mengikuti distance. Coba memisahkan satu hal yang berubah dari hal yang tetap.',
      'duration controls seconds. Distance still follows distance. Try separating the value that changes from the one that stays fixed.',
    ],
    [
      [
        'const distance',
        'const memberi nama pada sebuah nilai. Di sini distance menyimpan jarak dalam piksel.',
        'const gives a value a name. Here distance stores a distance in pixels.',
      ],
      [
        'gsap.to(',
        'gsap.to memilih target dan mengubah propertinya dari keadaan sekarang menuju tujuan.',
        'gsap.to selects a target and changes its properties from the current state to a destination.',
      ],
    ],
    ['duration = 1.2', 'duration = 2.4'],
    ['Tempo dua kali lebih pelan', 'Half-speed pacing'],
    [
      'Amati jarak akhir yang sama dengan waktu tempuh lebih lama.',
      'Observe the same destination reached over a longer time.',
    ],
  ),
  coordinates: a(
    ['orientation'],
    ['xPercent: 100 mengacu pada ukuran apa?', 'What does xPercent: 100 measure against?'],
    [
      ['Lebar layar', 'Screen width'],
      ['Lebar pembungkus', 'Container width'],
      ['Lebar target', 'Target width'],
    ],
    2,
    [
      'Persentase transform mengikuti target itu sendiri. Inilah mengapa satuan ini berguna untuk elemen dengan ukuran yang dapat berubah.',
      'Transform percentages use the target itself. This makes them useful when the target size can change.',
    ],
    [
      [
        'xPercent:',
        '100 berarti satu lebar target ke kanan. Angka negatif berarti ke kiri.',
        '100 means one target width to the right. A negative value means left.',
      ],
      [
        'yPercent:',
        'Sumbu y positif mengarah ke bawah; negatif mengarah ke atas.',
        'Positive y points down; negative y points up.',
      ],
    ],
    ['xPercent: 100', 'xPercent: -100'],
    ['Balik arah horizontal', 'Reverse horizontal direction'],
    [
      'Bandingkan tanda angka sambil mempertahankan durasi dan jarak vertikal.',
      'Compare the sign while keeping duration and vertical distance unchanged.',
    ],
  ),
  selectors: a(
    ['orientation'],
    ['Selector .item memilih elemen yang mana?', 'Which elements does .item select?'],
    [
      ['Semua elemen dengan class item', 'Every element with class item'],
      ['Hanya item pertama', 'Only the first item'],
      ['Semua tombol', 'Every button'],
    ],
    0,
    [
      'Titik menandai class CSS. GSAP mengumpulkan semua elemen yang cocok, sehingga satu tween dapat menargetkan beberapa elemen.',
      'A dot denotes a CSS class. GSAP collects all matching elements, so one tween can target several elements.',
    ],
    [
      [
        'gsap.to(',
        'String .item adalah selector CSS. Cocokkan dengan class pada tab HTML.',
        'The .item string is a CSS selector. Match it to the class in the HTML tab.',
      ],
      [
        'stagger:',
        'stagger menggeser waktu mulai setiap target; ini belum mengubah jarak target.',
        'stagger offsets each target’s start time; it does not change the target distance.',
      ],
    ],
    ['y: -40', 'y: 40'],
    ['Masuk ke arah bawah', 'Move downward'],
    [
      'Nilai y positif mengubah arah tanpa mengubah jumlah target.',
      'A positive y changes direction without changing the number of targets.',
    ],
  ),
  properties: a(
    ['coordinates', 'selectors'],
    ['scale: 0.8 berarti apa?', 'What does scale: 0.8 mean?'],
    [
      ['Lebar 0.8 piksel', '0.8 pixels wide'],
      ['80% ukuran awal', '80% of the starting size'],
      ['80 derajat', '80 degrees'],
    ],
    1,
    [
      'Scale adalah faktor pengali ukuran. Nilai 1 mempertahankan ukuran; 0.8 membuatnya 80%. Rotation memakai derajat, bukan faktor skala.',
      'Scale multiplies size. 1 preserves it; 0.8 makes it 80%. Rotation uses degrees rather than a scale factor.',
    ],
    [
      [
        'rotation:',
        'rotation mengatur sudut dalam derajat. Beberapa properti dapat berubah bersama dalam satu tween.',
        'rotation uses degrees. Several properties can change together in one tween.',
      ],
      [
        'scale:',
        'scale mengalikan ukuran visual tanpa menata ulang elemen di sekitarnya.',
        'scale multiplies visual size without rearranging neighboring elements.',
      ],
    ],
    ['rotation: 90', 'rotation: 180'],
    ['Putaran setengah lingkaran', 'A half turn'],
    [
      'Fokus pada rotasi; jarak dan skala tetap mengikuti contoh awal.',
      'Focus on rotation; distance and scale still follow the initial example.',
    ],
  ),
  to: a(
    ['properties'],
    ['gsap.to() membaca titik awal dari mana?', 'Where does gsap.to() read its starting state?'],
    [
      ['Selalu dari nol', 'Always from zero'],
      ['Dari objek baru yang wajib ditulis', 'From a required extra object'],
      ['Dari keadaan target saat tween mulai', 'From the target state when the tween starts'],
    ],
    2,
    [
      'to() hanya meminta tujuan. GSAP membaca keadaan saat ini untuk membuat perubahan bertahap menuju tujuan tersebut.',
      'to() asks for the destination. GSAP reads the current state and gradually changes it toward that destination.',
    ],
    [
      [
        'x: distance',
        'x memakai nilai konstanta distance; nama variabel tidak perlu diapit tanda kutip.',
        'x uses the distance constant; a variable name does not need quotation marks.',
      ],
      [
        'duration:',
        'duration adalah waktu perjalanan dalam detik. Ubah terpisah dari x untuk memahami pengaruhnya.',
        'duration is travel time in seconds. Change it separately from x to understand its effect.',
      ],
    ],
    ['distance = 180', 'distance = 80'],
    ['Tujuan yang lebih dekat', 'A closer destination'],
    [
      'Durasi tetap sama, tetapi kotak menempuh jarak lebih pendek.',
      'Duration stays the same while the box travels a shorter distance.',
    ],
  ),
  from: a(
    ['to'],
    ['Pada from(), opacity: 0 adalah keadaan…', 'In from(), opacity: 0 is the…'],
    [
      ['Awal', 'Starting state'],
      ['Akhir', 'Final state'],
      ['Selamanya', 'Permanent state'],
    ],
    0,
    [
      'from() memberi nilai awal, lalu menuju tampilan yang sudah dimiliki elemen. Ini cocok untuk animasi masuk.',
      'from() supplies starting values, then moves toward the element’s existing appearance. It suits entrance animations.',
    ],
    [
      [
        'gsap.from(',
        'Metode from membaca tujuan dari tampilan elemen yang sudah ada.',
        'from reads the destination from the element’s existing appearance.',
      ],
      [
        'opacity: 0',
        'Opacity nol pada from membuat target mulai tidak terlihat, lalu kembali terlihat.',
        'Zero opacity in from starts the target invisible and reveals it.',
      ],
    ],
    ['y: 70', 'y: -70'],
    ['Masuk dari atas', 'Enter from above'],
    [
      'Titik akhir tetap, sedangkan asal animasi pindah dari bawah ke atas.',
      'The destination stays fixed while the origin moves from below to above.',
    ],
  ),
  set: a(
    ['to', 'from'],
    ['Berapa lama gsap.set() berlangsung?', 'How long does gsap.set() take?'],
    [
      ['Satu detik', 'One second'],
      ['Langsung, tanpa transisi waktu', 'Immediately, with no timed transition'],
      ['Mengikuti duration berikutnya', 'It follows the next duration'],
    ],
    1,
    [
      'set() menerapkan nilai seketika. Tween sesudahnya dapat memakai keadaan itu sebagai titik awal.',
      'set() applies values immediately. The following tween can use that state as its starting point.',
    ],
    [
      [
        'gsap.set(',
        'Baris persiapan ini mengubah keadaan sebelum tween dimulai.',
        'This setup line changes the state before the tween begins.',
      ],
      [
        'scale: 1',
        'Tween berikutnya mengembalikan ukuran ke skala normal secara bertahap.',
        'The following tween gradually returns the element to normal size.',
      ],
    ],
    ['rotation: -15', 'rotation: 25'],
    ['Persiapan sudut berbeda', 'A different starting angle'],
    [
      'Amati perubahan keadaan awal, kemudian kotak kembali ke rotasi nol.',
      'Observe the different starting state, followed by a return to zero rotation.',
    ],
  ),
  'from-to': a(
    ['from', 'to'],
    [
      'Di objek mana duration diletakkan pada fromTo()?',
      'Which object contains duration in fromTo()?',
    ],
    [
      ['Objek awal', 'The starting object'],
      ['Di dalam selector', 'Inside the selector'],
      ['Objek tujuan', 'The destination object'],
    ],
    2,
    [
      'Objek awal berisi nilai visual awal. Objek tujuan membawa nilai akhir dan pengaturan waktu tween.',
      'The starting object contains initial visual values. The destination object contains final values and timing settings.',
    ],
    [
      [
        '{ x: 0',
        'Objek ini menetapkan keadaan awal secara eksplisit, termasuk transparansi.',
        'This object explicitly sets the start, including opacity.',
      ],
      [
        '{ x: 180',
        'Objek kedua berisi tujuan beserta duration. Perhatikan koma yang memisahkan kedua objek.',
        'The second object holds the destination and duration. Notice the comma between the objects.',
      ],
    ],
    ['x: 180', 'x: 100'],
    ['Tujuan lebih dekat', 'A closer endpoint'],
    [
      'Awal tetap sama; hanya tujuan yang berubah.',
      'The starting state stays the same; only the endpoint changes.',
    ],
  ),
  relative: a(
    ['to'],
    ['Apa arti x: "+=80"?', 'What does x: "+=80" mean?'],
    [
      ['Tambah 80 dari keadaan awal tween', 'Add 80 to the tween’s starting state'],
      ['Selalu menuju x nol', 'Always go to x zero'],
      ['80% lebar layar', '80% of the screen width'],
    ],
    0,
    [
      'String += menunjukkan tambahan relatif. Repeat biasa tetap mengulang titik awal dan akhir yang sama.',
      'The += string denotes a relative addition. A normal repeat still replays the same start and end.',
    ],
    [
      [
        'x: "+=',
        'Tanda kutip menjaga +=80 sebagai nilai relatif yang dapat dibaca GSAP.',
        'Quotation marks preserve +=80 as a relative value that GSAP can interpret.',
      ],
      [
        'repeat:',
        'repeat menambah putaran, tanpa otomatis menumpuk nilai relatif pada putaran berikutnya.',
        'repeat adds iterations without automatically accumulating the relative value each time.',
      ],
    ],
    ['repeat: 1', 'repeat: 2'],
    ['Hitung pengulangannya', 'Count the repetitions'],
    [
      'Ada tiga pemutaran total. Perhatikan bahwa titik akhirnya tidak terus bertambah.',
      'There are three plays in total. Notice that the endpoint does not keep increasing.',
    ],
  ),
  origin: a(
    ['properties'],
    ['"0% 100%" berada di sudut mana?', 'Which corner is "0% 100%"?'],
    [
      ['Kanan atas', 'Top right'],
      ['Kiri bawah', 'Bottom left'],
      ['Tengah', 'Center'],
    ],
    1,
    [
      'Urutannya horizontal lalu vertikal. Nol horizontal adalah kiri, seratus persen vertikal adalah bawah.',
      'The order is horizontal then vertical. Horizontal zero is left; vertical one hundred percent is bottom.',
    ],
    [
      [
        'transformOrigin:',
        'Dua persentase ini menempatkan titik tumpu pada target.',
        'These two percentages place the target’s pivot.',
      ],
      [
        'rotation:',
        'Sudut yang sama dapat menghasilkan lintasan berbeda ketika titik tumpunya berubah.',
        'The same angle can produce a different path when the pivot changes.',
      ],
    ],
    ['50% 50%', '100% 0%'],
    ['Engsel kanan atas', 'Top-right hinge'],
    [
      'Bandingkan putaran dari sudut dengan putaran dari pusat.',
      'Compare rotation around a corner with rotation around the center.',
    ],
  ),
  'auto-alpha': a(
    ['from'],
    ['Apa yang dikelola autoAlpha selain opacity?', 'What does autoAlpha manage besides opacity?'],
    [
      ['Lebar elemen', 'Element width'],
      ['Jumlah target', 'Target count'],
      ['Visibility', 'Visibility'],
    ],
    2,
    [
      'Ketika autoAlpha mencapai nol, visibility menjadi hidden. Ruang layout tetap tersedia.',
      'When autoAlpha reaches zero, visibility becomes hidden. Layout space remains available.',
    ],
    [
      [
        'autoAlpha:',
        'Dalam from(), nilai ini menetapkan transparansi awal sebelum kartu muncul.',
        'In from(), this value sets initial transparency before the cards appear.',
      ],
      [
        'stagger:',
        'Kartu berbagi tween, tetapi waktu mulainya bergiliran.',
        'The cards share a tween, but their start times are offset.',
      ],
    ],
    ['y: 25', 'y: -25'],
    ['Kartu turun dari atas', 'Cards enter from above'],
    [
      'Perubahan arah tetap memakai pola kemunculan kelompok yang sama.',
      'The changed direction preserves the same group reveal pattern.',
    ],
  ),
  easing: a(
    ['to'],
    ['Apakah easing mengubah tujuan akhir?', 'Does easing change the final destination?'],
    [
      ['Tidak, ia membentuk laju perubahan', 'No, it shapes the rate of change'],
      ['Ya, selalu lebih jauh', 'Yes, it always goes farther'],
      ['Ya, menjadi acak', 'Yes, it becomes random'],
    ],
    0,
    [
      'Easing mengatur bagaimana nilai berubah sepanjang waktu. Tujuan dan durasi tetap mengikuti tween.',
      'Easing controls how values change over time. The destination and duration still follow the tween.',
    ],
    [
      [
        'const ease',
        'String ini memilih kurva percepatan. none memberi hubungan waktu dan posisi yang linear.',
        'This string selects an acceleration curve. none makes time and position linear.',
      ],
      [
        'ease: "none"',
        'Kotak pembanding tetap linear agar perbedaan tempo terlihat jelas.',
        'The comparison box stays linear so pacing differences are visible.',
      ],
    ],
    ['const ease = "none"', 'const ease = "power2.in"'],
    ['Mulai pelan, selesai cepat', 'Start slowly, finish quickly'],
    [
      'Bandingkan posisi kedua kotak saat progres berada di tengah.',
      'Compare the box positions at halfway progress.',
    ],
  ),
  delay: a(
    ['to'],
    ['delay ditambahkan kapan?', 'When is delay added?'],
    [
      ['Di setiap frame', 'On every frame'],
      ['Sebelum tween mulai', 'Before the tween starts'],
      ['Hanya setelah selesai', 'Only after completion'],
    ],
    1,
    [
      'Delay adalah waktu tunggu sebelum animasi. Ia tidak memperlambat perjalanan tween itu sendiri.',
      'Delay is a wait before animation. It does not slow down the tween’s movement itself.',
    ],
    [
      [
        'delay:',
        'Delay memberi ruang waktu sebelum properti mulai berubah.',
        'Delay leaves time before properties start changing.',
      ],
      [
        'duration,',
        'Penulisan singkat ini berarti duration: duration, memakai konstanta di atas.',
        'This shorthand means duration: duration, using the constant above.',
      ],
    ],
    ['delay: 0.5', 'delay: 0'],
    ['Mulai tanpa jeda', 'Start immediately'],
    [
      'Perjalanan tetap sama, tetapi waktu tunggu awal hilang.',
      'The travel stays the same, but the initial waiting time disappears.',
    ],
  ),
  repeat: a(
    ['delay'],
    [
      'repeat: 2 menghasilkan berapa pemutaran total?',
      'How many total plays does repeat: 2 produce?',
    ],
    [
      ['Dua', 'Two'],
      ['Satu', 'One'],
      ['Tiga', 'Three'],
    ],
    2,
    [
      'Repeat menghitung putaran tambahan setelah putaran pertama. Dua tambahan berarti tiga pemutaran.',
      'Repeat counts extra iterations after the first. Two extras mean three plays.',
    ],
    [
      [
        'repeat:',
        'Angka ini menghitung pengulangan tambahan. Hindari nilai tak terbatas selama latihan.',
        'This counts extra iterations. Avoid infinite values while practicing.',
      ],
      [
        'yoyo:',
        'true membalik arah setiap putaran berikutnya, seperti pergi lalu pulang.',
        'true reverses direction on alternating iterations, like an outward and return trip.',
      ],
    ],
    ['yoyo: true', 'yoyo: false'],
    ['Ulang tanpa membalik arah', 'Repeat without reversing'],
    [
      'Amati lompatan kembali ke awal pada batas putaran.',
      'Observe the jump back to the start at the iteration boundary.',
    ],
  ),
  'repeat-delay': a(
    ['repeat'],
    ['repeatDelay menunggu di bagian mana?', 'Where does repeatDelay wait?'],
    [
      ['Di antara putaran', 'Between iterations'],
      ['Sebelum putaran pertama saja', 'Only before the first iteration'],
      ['Di setiap perubahan properti', 'On every property change'],
    ],
    0,
    [
      'repeatDelay adalah jeda antarputaran. Untuk jeda sebelum mulai, pakai delay.',
      'repeatDelay is the gap between iterations. Use delay for the initial wait.',
    ],
    [
      [
        'repeatDelay:',
        'Jeda ini tidak termasuk durasi satu putaran.',
        'This gap is separate from the duration of one iteration.',
      ],
      [
        'yoyo:',
        'Dengan yoyo, jeda terasa seperti berhenti sejenak sebelum kembali.',
        'With yoyo, the pause feels like waiting briefly before returning.',
      ],
    ],
    ['yoyo: true', 'yoyo: false'],
    ['Jeda lalu kembali ke awal', 'Pause, then reset'],
    [
      'Bandingkan pengulangan satu arah dengan pergi-pulang.',
      'Compare one-way repetition with alternating directions.',
    ],
  ),
  keyframes: a(
    ['to', 'delay'],
    ['Objek di dalam array keyframes ini berjalan…', 'Objects in this keyframes array run…'],
    [
      ['Selalu bersamaan', 'Always simultaneously'],
      ['Berurutan', 'Sequentially'],
      ['Hanya yang terakhir', 'Only the last one runs'],
    ],
    1,
    [
      'Bentuk array menyusun langkah secara berurutan. Tiap objek bisa mempunyai durasi dan properti sendiri.',
      'The array form sequences steps. Each object can have its own duration and properties.',
    ],
    [
      [
        'keyframes:',
        'Tanda [] membuka daftar pose. Koma memisahkan objek-objek di dalamnya.',
        'Square brackets open a pose list. Commas separate its objects.',
      ],
      [
        '{ y: -50',
        'Pose ini hanya mengubah y; x mempertahankan nilai dari pose sebelumnya.',
        'This pose changes only y; x keeps the preceding pose’s value.',
      ],
    ],
    ['y: -50', 'y: 50'],
    ['Lintasan ke bawah', 'A downward route'],
    [
      'Pose tengah berubah arah, sementara pose pulang tetap sama.',
      'The middle pose changes direction while the returning pose stays the same.',
    ],
  ),
  timeline: a(
    ['to', 'delay'],
    ['Tanpa position, tween berikutnya dimulai…', 'Without a position, the next tween starts…'],
    [
      ['Bersamaan dengan yang pertama', 'With the first tween'],
      ['Setelah satu frame', 'After one frame'],
      ['Sesudah ujung timeline', 'After the timeline’s current end'],
    ],
    2,
    [
      'Timeline menambahkan tween ke ujung rangkaian. Karena itu kamu tidak perlu menebak delay setiap langkah.',
      'A timeline appends tweens to the end of the sequence. You do not need to guess a delay for each step.',
    ],
    [
      [
        'gsap.timeline',
        'Simpan timeline dalam tl agar tween berikutnya masuk ke rangkaian yang sama.',
        'Store the timeline in tl so following tweens join the same sequence.',
      ],
      [
        '.to(".item-2"',
        'Pemanggilan berantai menambahkan tween, bukan membuat timeline baru.',
        'Chained calls add tweens rather than creating a new timeline.',
      ],
    ],
    ['distance = 180', 'distance = 80'],
    ['Rangkaian yang lebih dekat', 'A shorter journey'],
    [
      'Ketiga target menempuh jarak lebih pendek dalam urutan yang sama.',
      'All targets travel less in the same order.',
    ],
  ),
  overlap: a(
    ['timeline'],
    ['Position "<" mengacu pada…', 'The position "<" refers to…'],
    [
      ['Awal animasi yang terakhir ditambahkan', 'The start of the most recently added animation'],
      ['Awal halaman', 'The start of the page'],
      ['Akhir semua repeat', 'The end of every repeat'],
    ],
    0,
    [
      'Tanda < mengacu pada waktu awal animasi sebelumnya yang ditambahkan. Ini berbeda dari awal timeline secara keseluruhan.',
      '< refers to the start of the most recently inserted animation, not necessarily the whole timeline’s start.',
    ],
    [
      [
        '"-=0.5"',
        'Tween masuk setengah detik sebelum ujung timeline saat itu.',
        'The tween starts half a second before the timeline’s current end.',
      ],
      [
        '"<"',
        'Tween ketiga berbagi waktu awal dengan tween sebelumnya.',
        'The third tween shares its start with the preceding tween.',
      ],
    ],
    ['"-=0.5"', '">"'],
    ['Bandingkan tanpa overlap pertama', 'Compare without the first overlap'],
    [
      'Tween kedua menunggu ujung tween sebelumnya. Track membantu melihat perubahan itu.',
      'The second tween waits for the preceding tween’s end. Tracks reveal the change.',
    ],
  ),
  labels: a(
    ['overlap'],
    [
      'Apakah addLabel() sendiri membuat animasi?',
      'Does addLabel() create an animation by itself?',
    ],
    [
      ['Ya, selalu satu tween', 'Yes, always one tween'],
      ['Tidak, ia memberi nama pada waktu', 'No, it names a time'],
      ['Ya, mengubah opacity', 'Yes, it changes opacity'],
    ],
    1,
    [
      'Label adalah alamat waktu yang dapat dipakai beberapa tween. Ia membantu rangkaian mudah dibaca dan diubah.',
      'A label is a time address shared by tweens. It makes sequences easier to read and change.',
    ],
    [
      [
        'addLabel("intro")',
        'Label memberi nama pada posisi timeline saat ini.',
        'A label names the current timeline position.',
      ],
      [
        '"intro+=0.3"',
        'Alamat ini berarti 0.3 detik setelah label intro, bukan setelah tween sebelumnya.',
        'This address is 0.3 seconds after intro, not after the previous tween.',
      ],
    ],
    ['intro+=0.3', 'intro+=0.8'],
    ['Jarak waktu antarmomen', 'A larger timing gap'],
    [
      'Tween kedua tetap memakai label yang sama, tetapi offset waktunya lebih besar.',
      'The second tween uses the same label with a larger time offset.',
    ],
  ),
  stagger: a(
    ['selectors', 'timeline'],
    [
      'Dengan 3 target dan stagger: 0.3, awal target terakhir adalah…',
      'With 3 targets and stagger: 0.3, the last target starts at…',
    ],
    [
      ['0.3 detik', '0.3 seconds'],
      ['0.9 detik', '0.9 seconds'],
      ['0.6 detik', '0.6 seconds'],
    ],
    2,
    [
      'Waktu awalnya 0, 0.3, dan 0.6. Durasi tween masing-masing ditambahkan sesudah waktu awal itu.',
      'The starts are 0, 0.3, and 0.6. Each tween’s duration is added after its start.',
    ],
    [
      [
        'gsap.from(',
        'Semua elemen yang cocok dengan .item menerima keadaan awal yang sama.',
        'All elements matching .item receive the same starting state.',
      ],
      [
        'stagger:',
        'Satu angka ini mengatur selisih awal, bukan durasi total kelompok.',
        'This number sets the starting gap, not the total group duration.',
      ],
    ],
    ['stagger: 0.15', 'stagger: 0'],
    ['Mulai bersamaan', 'Start together'],
    [
      'Bandingkan urutan bergiliran dengan kelompok yang muncul serentak.',
      'Compare offset starts with a group entering simultaneously.',
    ],
  ),
  defaults: a(
    ['timeline'],
    [
      'Nilai tween anak yang ditulis sendiri akan…',
      'An explicitly written child tween value will…',
    ],
    [
      ['Menggantikan defaults untuk properti itu', 'Override that property’s default'],
      ['Selalu diabaikan', 'Always be ignored'],
      ['Menghapus timeline', 'Remove the timeline'],
    ],
    0,
    [
      'Defaults menyediakan nilai awal. Tween anak tetap bisa punya pengaturan yang lebih khusus.',
      'Defaults supply baseline values. A child tween can still provide a more specific setting.',
    ],
    [
      [
        'defaults:',
        'Objek ini memberi duration dan ease kepada tween anak.',
        'This object supplies duration and ease to child tweens.',
      ],
      [
        '.to(".item-1"',
        'Tween ini hanya menulis x karena durasi dan easing sudah diwarisi.',
        'This tween only writes x because duration and easing are inherited.',
      ],
    ],
    ['power2.out', 'none'],
    ['Easing bersama yang linear', 'Shared linear easing'],
    [
      'Satu pengaturan easing mengubah rasa ketiga tween.',
      'One easing setting changes the character of all three tweens.',
    ],
  ),
  'stagger-order': a(
    ['stagger'],
    ['from: "end" di dalam stagger mengubah…', 'from: "end" inside stagger changes…'],
    [
      ['Tujuan x', 'The x destination'],
      ['Urutan awal elemen', 'The starting order'],
      ['Ukuran semua target', 'Every target’s size'],
    ],
    1,
    [
      'from di sini menentukan asal urutan kelompok. Nama propertinya mirip gsap.from(), tetapi perannya berbeda.',
      'Here from sets the origin of the group’s order. Its name resembles gsap.from(), but its role is different.',
    ],
    [
      [
        'each:',
        'each menentukan selisih waktu mulai antarelemen.',
        'each sets the start-time gap between elements.',
      ],
      [
        'from: "start"',
        'start berarti urutan target biasa; end membalikkannya dan center mulai di tengah.',
        'start follows normal target order; end reverses it and center begins in the middle.',
      ],
    ],
    ['from: "start"', 'from: "center"'],
    ['Mulai dari tengah', 'Start at the center'],
    ['Perhatikan elemen 02 mendapat giliran lebih dahulu.', 'Notice element 02 starting first.'],
  ),
  speed: a(
    ['timeline'],
    ['timeScale(2) akan membuat pemutaran…', 'timeScale(2) makes playback…'],
    [
      ['Dua kali lebih lama', 'Twice as long'],
      ['Tidak berubah', 'Unchanged'],
      ['Dua kali lebih cepat', 'Twice as fast'],
    ],
    2,
    [
      'timeScale adalah pengali laju waktu, bukan durasi. Nilai besar mempercepat; nilai kecil memperlambat.',
      'timeScale multiplies the clock rate, not the duration. Larger values speed up; smaller values slow down.',
    ],
    [
      [
        'gsap.timeline',
        'Tween tetap punya durasi rancangan satu detik masing-masing.',
        'Each tween keeps its designed duration of one second.',
      ],
      [
        'tl.timeScale',
        'Pengali ini memengaruhi seluruh timeline dan semua anaknya.',
        'This multiplier affects the whole timeline and its children.',
      ],
    ],
    ['timeScale(1)', 'timeScale(2)'],
    ['Putar lebih cepat', 'Play faster'],
    [
      'Track tetap sama panjang, tetapi rangkaian selesai lebih cepat.',
      'The tracks keep the same length, but playback finishes sooner.',
    ],
  ),
  click: a(
    ['timeline'],
    ['Kenapa restart() dibungkus () => ...?', 'Why is restart() wrapped in () => ...?'],
    [
      ['Agar menunggu klik', 'So it waits for a click'],
      ['Agar jarak bertambah', 'So distance increases'],
      ['Agar selector berubah', 'So the selector changes'],
    ],
    0,
    [
      'Event membutuhkan fungsi untuk dipanggil nanti. Tanpa pembungkus, restart() akan dipanggil saat listener dipasang.',
      'An event needs a function to call later. Without the wrapper, restart() is called while installing the listener.',
    ],
    [
      [
        'paused: true',
        'Tween disiapkan tetapi belum diputar.',
        'The tween is prepared but does not play yet.',
      ],
      [
        'addEventListener',
        'Listener menghubungkan tombol HTML dan aksi restart pada tween yang sama.',
        'The listener connects the HTML button with restarting the same tween.',
      ],
    ],
    ['duration = 1.2', 'duration = 0.4'],
    ['Respons klik lebih singkat', 'A quicker click response'],
    [
      'Jalankan dahulu untuk memasang event, kemudian aktifkan tombol di preview.',
      'Run first to install the event, then activate the preview button.',
    ],
  ),
  hover: a(
    ['click'],
    ['Apa pasangan keluar untuk focus?', 'Which event pairs with leaving focus?'],
    [
      ['click', 'click'],
      ['blur', 'blur'],
      ['restart', 'restart'],
    ],
    1,
    [
      'focus dan blur memberi pengguna keyboard pengalaman masuk-keluar yang setara dengan hover.',
      'focus and blur give keyboard users an enter-and-exit experience equivalent to hovering.',
    ],
    [
      [
        'tween.play()',
        'Play melanjutkan tween yang sama ke depan, tanpa membuat tween baru.',
        'Play continues the same tween forward without creating another one.',
      ],
      [
        'tween.reverse()',
        'Reverse memakai nilai sekarang lalu menuju keadaan awal.',
        'Reverse uses the current position and returns toward the starting state.',
      ],
    ],
    ['rotation: 8', 'rotation: -8'],
    ['Condong ke arah sebaliknya', 'Tilt the other way'],
    [
      'Coba hover, lalu coba tombol Fokus kotak untuk jalur keyboard.',
      'Try hovering, then use Focus box for the keyboard path.',
    ],
  ),
  callbacks: a(
    ['click'],
    ['Kapan onComplete dipanggil?', 'When does onComplete run?'],
    [
      ['Sebelum tween dibuat', 'Before the tween is created'],
      ['Setiap mengetik', 'On every keystroke'],
      ['Ketika tween selesai', 'When the tween completes'],
    ],
    2,
    [
      'GSAP menunggu tween selesai, kemudian memanggil fungsi callback. Dengan demikian status mengikuti hasil pemutaran.',
      'GSAP waits for the tween to finish, then calls the callback function. The status can follow actual playback.',
    ],
    [
      [
        'const status',
        'querySelector mencari elemen status yang teksnya akan diperbarui.',
        'querySelector finds the status element whose text will change.',
      ],
      [
        'onComplete:',
        'Fungsi di dalamnya baru dijalankan ketika animasi selesai.',
        'The function inside runs when the animation completes.',
      ],
    ],
    ['y: 35', 'y: -35'],
    ['Status yang sama, arah berbeda', 'Same status, different direction'],
    [
      'Arah masuk berubah; callback tetap menunggu animasi selesai.',
      'The entrance direction changes; the callback still waits for completion.',
    ],
  ),
  overwrite: a(
    ['click', 'hover'],
    ['overwrite: "auto" menangani apa?', 'What does overwrite: "auto" handle?'],
    [
      ['Properti bertabrakan pada tween aktif', 'Conflicting properties on active tweens'],
      ['Seluruh isi HTML', 'All HTML content'],
      ['Hanya warna background', 'Only background colors'],
    ],
    0,
    [
      'Mode auto memeriksa konflik properti saat tween mulai. Properti lain yang tidak bertabrakan dapat tetap berjalan.',
      'Auto checks property conflicts as the tween initializes. Unrelated properties can continue running.',
    ],
    [
      [
        'addEventListener',
        'Tween baru dibuat setiap tombol diklik, dari keadaan target saat itu.',
        'A new tween is created on every click, starting from the target’s current state.',
      ],
      [
        'overwrite:',
        'Properti ini membantu instruksi baru mengambil alih properti yang bertabrakan.',
        'This setting lets the new instruction take over conflicting properties.',
      ],
    ],
    ['duration = 0.7', 'duration = 2'],
    ['Amati respons selama transisi', 'Inspect responses during a transition'],
    [
      'Klik beberapa kali ketika kotak masih berpindah untuk mengamati perilakunya.',
      'Click several times while the box is still traveling and observe its behavior.',
    ],
  ),
  utils: a(
    ['to'],
    ['Apa hasil clamp(0, 180, 360)?', 'What is clamp(0, 180, 360)?'],
    [
      ['360', '360'],
      ['180', '180'],
      ['0', '0'],
    ],
    1,
    [
      'Input 360 melampaui batas maksimum 180. Clamp mengembalikan batas itu sebagai hasil.',
      'Input 360 exceeds the maximum of 180. Clamp returns that maximum.',
    ],
    [
      [
        'const limitedX',
        'Perhitungan menghasilkan angka biasa sebelum tween dibuat.',
        'The calculation produces a normal number before creating the tween.',
      ],
      [
        'x: limitedX',
        'Tween menerima hasil perhitungan, bukan menjalankan fungsi clamp setiap frame.',
        'The tween receives the calculated result rather than running clamp every frame.',
      ],
    ],
    ['clamp(0, 180, 360)', 'clamp(0, 180, 100)'],
    ['Input dalam rentang', 'An input inside the range'],
    [
      'Nilai 100 berada di dalam batas, sehingga dikembalikan tanpa dipotong.',
      '100 is within the bounds, so it is returned unchanged.',
    ],
  ),
  trigger: a(
    ['timeline'],
    ['Apa arti start: "top center"?', 'What does start: "top center" mean?'],
    [
      ['Pusat elemen bertemu atas', 'The element center meets the top'],
      ['Awal halaman saat dimuat', 'The page starts loading'],
      ['Atas trigger bertemu tengah scroller', 'The trigger top meets the scroller center'],
    ],
    2,
    [
      'Kata pertama adalah posisi pada trigger, kata kedua posisi di viewport scroller. Penanda membantu melihat pertemuannya.',
      'The first word is a position on the trigger; the second is a position in the scroller viewport. Markers reveal where they meet.',
    ],
    [
      [
        'scroller:',
        'Scroller menunjuk panel preview agar scroll halaman utama tetap terpisah.',
        'Scroller points to the preview panel so the main page scroll stays independent.',
      ],
      [
        'start:',
        'Dua posisi ini menentukan kapan tween dipicu.',
        'These two positions determine when the tween is triggered.',
      ],
    ],
    ['markers: true', 'markers: false'],
    ['Sembunyikan penanda', 'Hide the markers'],
    [
      'Perilaku animasi tetap sama meskipun garis bantu disembunyikan.',
      'The animation behaves the same when helper markers are hidden.',
    ],
  ),
  scrub: a(
    ['trigger'],
    ['Dengan scrub, progres animasi mengikuti…', 'With scrub, animation progress follows…'],
    [
      ['Posisi scroll dalam rentang', 'Scroll position within the range'],
      ['Jumlah klik', 'Click count'],
      ['Waktu mengetik', 'Typing time'],
    ],
    0,
    [
      'Scroll menjadi playhead. Rentang antara start dan end dipetakan ke progres 0 sampai 1.',
      'Scroll becomes the playhead. The range from start to end maps to progress from 0 to 1.',
    ],
    [
      [
        'const scrub',
        'true menghubungkan progres langsung dengan posisi scroll.',
        'true links progress directly to the scroll position.',
      ],
      [
        'end:',
        'Nilai relatif ini menentukan panjang rentang scroll setelah start.',
        'This relative value defines the scroll range after start.',
      ],
    ],
    ['const scrub = true', 'const scrub = false'],
    ['Bandingkan dengan pemicu biasa', 'Compare a regular trigger'],
    [
      'Saat scrub mati, scroll memicu tween yang kemudian memakai waktunya sendiri.',
      'With scrub disabled, scroll triggers a tween that then uses its own clock.',
    ],
  ),
  pin: a(
    ['scrub'],
    ['Apa yang ditahan oleh pin di contoh ini?', 'What does pin hold in this example?'],
    [
      ['Seluruh halaman aplikasi', 'The whole application page'],
      ['Pembungkus .pin-area', 'The .pin-area wrapper'],
      ['Semua elemen selamanya', 'Every element forever'],
    ],
    1,
    [
      'Wrapper ditahan selama rentang aktif. Anak di dalamnya tetap dapat dianimasikan.',
      'The wrapper is held during the active range. Its child can still animate.',
    ],
    [
      [
        'const pin',
        'Konstanta ini memilih apakah fitur pin diaktifkan.',
        'This constant chooses whether pinning is enabled.',
      ],
      [
        'pin: pin ?',
        'Operator ? : memilih selector pembungkus atau false.',
        'The ? : operator chooses the wrapper selector or false.',
      ],
    ],
    ['const pin = true', 'const pin = false'],
    ['Lihat tanpa pin', 'See it without pinning'],
    [
      'Bandingkan aliran elemen dengan dan tanpa wrapper yang ditahan.',
      'Compare the flow with and without a held wrapper.',
    ],
  ),
  'scroll-timeline': a(
    ['scrub', 'timeline'],
    [
      'ScrollTrigger sebaiknya dipasang di mana untuk rangkaian ini?',
      'Where should ScrollTrigger go for this sequence?',
    ],
    [
      ['Di setiap anak dan induk', 'On every child and the parent'],
      ['Di selector CSS', 'In the CSS selector'],
      ['Pada timeline induk', 'On the parent timeline'],
    ],
    2,
    [
      'Satu pengendali pada induk menjaga semua tween memakai playhead yang sama.',
      'One controller on the parent keeps all tweens on the same playhead.',
    ],
    [
      [
        'scrollTrigger:',
        'Konfigurasi ini menghubungkan seluruh timeline dengan panel scroll.',
        'This configuration links the whole timeline to the scrolling panel.',
      ],
      [
        '.from(".scroll-caption"',
        'Tween teks dimulai setelah kotak selesai, sesuai urutan timeline.',
        'The caption tween starts after the box finishes, following the timeline order.',
      ],
    ],
    ['opacity: 0, duration: 0.5', 'opacity: 0, duration: 1.5'],
    ['Beri teks porsi lebih panjang', 'Give the caption more time'],
    [
      'Tween teks kini mengambil porsi rentang scroll yang lebih besar.',
      'The caption tween now takes a larger proportion of the scroll range.',
    ],
  ),
  'svg-attributes': a(
    ['properties'],
    ['Atribut r pada circle berarti…', 'A circle’s r attribute means…'],
    [
      ['Radius', 'Radius'],
      ['Rotasi', 'Rotation'],
      ['Jumlah repeat', 'Repeat count'],
    ],
    0,
    [
      'r adalah radius dalam koordinat SVG. rotation adalah properti transform yang berbeda.',
      'r is the radius in SVG coordinates. rotation is a different transform property.',
    ],
    [
      [
        'attr:',
        'Objek attr membungkus atribut SVG yang akan dianimasikan.',
        'The attr object holds SVG attributes to animate.',
      ],
      [
        'r: 40',
        'r mengubah radius; cx menggeser pusat horizontal.',
        'r changes the radius; cx shifts the horizontal center.',
      ],
    ],
    ['cx: 110', 'cx: 70'],
    ['Besar tanpa bergeser', 'Grow without shifting'],
    [
      'Pusat horizontal tetap pada keadaan awal, sementara radius membesar.',
      'The horizontal center remains at its initial value while the radius grows.',
    ],
  ),
  'svg-stroke': a(
    ['from-to', 'svg-attributes'],
    ['Offset akhir 0 akan membuat stroke…', 'A final offset of 0 makes the stroke…'],
    [
      ['Hilang seluruhnya', 'Disappear completely'],
      ['Terlihat seluruhnya', 'Fully visible'],
      ['Berubah menjadi fill', 'Turn into a fill'],
    ],
    1,
    [
      'Satu dash sepanjang path dibuka kembali ketika offset mencapai nol. Fill tidak dipengaruhi teknik ini.',
      'A dash as long as the path is fully revealed when the offset reaches zero. This technique does not affect fill.',
    ],
    [
      [
        'getTotalLength()',
        'Browser menghitung panjang geometris path untuk ukuran dash yang sesuai.',
        'The browser measures the path geometry to obtain the correct dash length.',
      ],
      [
        'strokeDashoffset: 60',
        'Ini offset tujuan; nol membuka garis sampai selesai.',
        'This is the destination offset; zero reveals the whole stroke.',
      ],
    ],
    ['ease: "none"', 'ease: "power2.inOut"'],
    ['Kecepatan menggambar berubah', 'A changing drawing speed'],
    [
      'Bandingkan laju menggambar tanpa mengubah bentuk garis.',
      'Compare drawing speed without changing the path shape.',
    ],
  ),
  'motion-path': a(
    ['svg-attributes'],
    ['end: 1 pada MotionPath berarti…', 'In MotionPath, end: 1 means…'],
    [
      ['Satu piksel', 'One pixel'],
      ['Satu detik', 'One second'],
      ['Seluruh panjang jalur', 'The entire path length'],
    ],
    2,
    [
      'start dan end memakai proporsi panjang jalur. Durasi tetap dikendalikan duration.',
      'start and end use proportions of the path length. duration still controls playback time.',
    ],
    [
      [
        'alignOrigin:',
        'Pusat penanda ditempatkan di rel dengan koordinat proporsional 0.5, 0.5.',
        'The marker’s center is placed on the route using proportional coordinates 0.5, 0.5.',
      ],
      [
        'autoRotate:',
        'true mengarahkan penanda mengikuti tangen jalur.',
        'true orients the marker along the path’s tangent.',
      ],
    ],
    ['autoRotate: true', 'autoRotate: false'],
    ['Orientasi tetap', 'A fixed orientation'],
    [
      'Penanda masih mengikuti jalur, tetapi tidak ikut berputar mengikuti arahnya.',
      'The marker still follows the path but no longer rotates with its direction.',
    ],
  ),
  context: a(
    ['callbacks', 'auto-alpha'],
    ['revert() berbeda dari pause() karena…', 'revert() differs from pause() because it…'],
    [
      ['Memulihkan style dan membersihkan animasi', 'Restores styles and cleans up animations'],
      ['Menambah durasi', 'Adds duration'],
      ['Menyimpan progres pelajaran', 'Saves lesson progress'],
    ],
    0,
    [
      'Pause hanya menghentikan playhead. Revert mengembalikan style sebelumnya dan menghapus animasi yang dikumpulkan.',
      'Pause only stops the playhead. Revert restores prior styles and removes collected animations.',
    ],
    [
      [
        'gsap.context(',
        'Callback mengumpulkan animasi yang dibuat di dalamnya; scope membatasi selector.',
        'The callback collects animations created inside; the scope limits selectors.',
      ],
      [
        'ctx.revert()',
        'Klik tombol memulihkan hasil pemasangan context.',
        'A button click restores the state before the context setup.',
      ],
    ],
    ['y: 35', 'y: -35'],
    ['Pasang dari arah berbeda', 'Set up another direction'],
    [
      'Setelah revert, keduanya kembali ke CSS awal yang sama.',
      'After revert, both versions return to the same original CSS.',
    ],
  ),
  'match-media': a(
    ['context'],
    [
      'Media query di praktik ini mengukur lebar…',
      'In this exercise, the media query measures the width of…',
    ],
    [
      ['Monitor fisik', 'The physical monitor'],
      ['Iframe preview', 'The preview iframe'],
      ['Kotak target', 'The target box'],
    ],
    1,
    [
      'Kode berjalan dalam iframe. Karena itu viewport media query adalah panel preview, yang dapat lebih sempit dari layar aplikasi.',
      'The code runs in an iframe. Its media-query viewport is the preview panel, which can be narrower than the application.',
    ],
    [
      [
        'mm.add(',
        'Objek kondisi memberi nama wide dan compact pada dua media query.',
        'The condition object names two media queries wide and compact.',
      ],
      [
        'context.conditions.wide',
        'Operator ternary memilih jarak berdasarkan apakah kondisi wide aktif.',
        'The ternary operator selects a distance based on whether wide is active.',
      ],
    ],
    ['wide ? 60 : 25', 'wide ? 90 : 25'],
    ['Jarak lebih jauh di layar lebar', 'More distance in a wide preview'],
    [
      'Versi compact tetap sama; ubah lebar preview untuk membandingkan.',
      'The compact version stays the same; resize the preview to compare.',
    ],
  ),
  'reduced-motion': a(
    ['match-media'],
    [
      'Saat pengguna mengurangi animasi, konten sebaiknya…',
      'When a person reduces motion, content should…',
    ],
    [
      ['Ikut dihapus', 'Be removed'],
      ['Menunggu animasi panjang', 'Wait for a long animation'],
      ['Tetap lengkap dan dapat digunakan', 'Remain complete and usable'],
    ],
    2,
    [
      'Pengurangan animasi adalah preferensi kenyamanan. Informasi dan fungsi tetap harus tersedia.',
      'Reduced motion is a comfort preference. Information and functionality must remain available.',
    ],
    [
      [
        'prefers-reduced-motion: reduce',
        'Media query ini membaca pengaturan aksesibilitas sistem.',
        'This media query reads the system accessibility preference.',
      ],
      [
        'duration: reduce ?',
        'Cabang reduce menampilkan hasil seketika; cabang penuh memakai durasi terbatas.',
        'The reduce branch shows an immediate result; the full-motion branch uses a bounded duration.',
      ],
    ],
    ['y: reduce ? 0 : 35', 'y: reduce ? 0 : 10'],
    ['Animasi penuh lebih tenang', 'A calmer full-motion version'],
    [
      'Cabang reduce tetap seketika, sedangkan cabang penuh memiliki jarak lebih pendek.',
      'The reduced branch stays immediate while the full-motion branch travels a shorter distance.',
    ],
  ),
  'project-menu': a(
    ['auto-alpha', 'stagger-order', 'click'],
    ['Apa tugas tombol preview di proyek ini?', 'What does this project’s preview button do?'],
    [
      ['Memutar ulang timeline yang disiapkan', 'Replay the prepared timeline'],
      ['Membuat materi baru', 'Create a new lesson'],
      ['Mengganti bahasa', 'Switch the language'],
    ],
    0,
    [
      'Kode menyiapkan satu timeline. Tombol memanggil restart() agar rangkaian yang sama dapat dipakai kembali.',
      'The code prepares one timeline. The button calls restart() so the same sequence can be reused.',
    ],
    [
      [
        'paused: true',
        'Timeline menunggu tombol sebelum memutar urutan.',
        'The timeline waits for the button before playing the sequence.',
      ],
      [
        'tl.restart()',
        'Event memakai timeline yang sama setiap kali tombol diaktifkan.',
        'The event reuses the same timeline whenever the button is activated.',
      ],
    ],
    ['x: -35', 'x: 35'],
    ['Kartu masuk dari kanan', 'Cards enter from the right'],
    [
      'Urutan dan kontrol tetap sama; arah masuk menjadi keputusan visual baru.',
      'Order and controls stay the same; the entrance direction becomes a new visual decision.',
    ],
  ),
  project: a(
    ['project-menu', 'scroll-timeline', 'reduced-motion'],
    [
      'Kenapa orb memakai ScrollTrigger terpisah?',
      'Why does the orb use a separate ScrollTrigger?',
    ],
    [
      ['Agar semua tween acak', 'To randomize every tween'],
      ['Ia punya pemicu dan bagian cerita sendiri', 'It has its own trigger and story section'],
      ['Agar halaman utama terkunci', 'To lock the main page'],
    ],
    1,
    [
      'Timeline masuk, tombol ulang, dan orb scroll memiliki tanggung jawab berbeda. Pemisahan itu membuat hasil lebih mudah dipahami.',
      'The entrance timeline, replay button, and scroll orb have different responsibilities. Separating them makes the result easier to understand.',
    ],
    [
      [
        'const tl',
        'Timeline ini menyusun kemunculan judul dan kartu.',
        'This timeline sequences the heading and card entrances.',
      ],
      [
        'trigger: ".project-zone"',
        'Bagian orb memakai rentang scroll sendiri setelah cerita masuk.',
        'The orb section uses its own scroll range after the entrance story.',
      ],
    ],
    ['duration = 0.7', 'duration = 1.4'],
    ['Cerita masuk lebih perlahan', 'A slower entrance story'],
    [
      'Amati rangkaian masuk melambat, sementara orb masih mengikuti scroll.',
      'Observe the slower entrance while the orb still follows scrolling.',
    ],
  ),
}

export function learningActivity(lesson: PracticeLesson): LearningActivity {
  const blueprint = activities[lesson.id]
  if (!blueprint || !lesson.code.includes(blueprint.change[0]))
    throw new Error(`Missing learning activity or variation for ${lesson.id}`)
  return {
    question: blueprint.question,
    choices: blueprint.choices,
    answer: blueprint.answer,
    explanation: blueprint.explanation,
    walkthrough: blueprint.walkthrough,
    prerequisites: blueprint.prerequisites,
    variation: {
      title: blueprint.variantTitle,
      observation: blueprint.observation,
      code: lesson.code.replaceAll(...blueprint.change),
    },
  }
}

export const glossary: { term: string; definition: Copy }[][] = [
  [
    {
      term: 'selector',
      definition: b(
        'Alamat elemen di HTML. .box memilih elemen dengan class box; titik berarti class.',
        'An address for HTML elements. .box selects elements with class box; the dot denotes a class.',
      ),
    },
    {
      term: 'const',
      definition: b(
        'Cara memberi nama pada sebuah nilai di JavaScript. Nilainya dapat dipakai lagi lewat nama itu.',
        'A way to name a JavaScript value. The name lets you reuse the value.',
      ),
    },
    {
      term: 'property',
      definition: b(
        'Satu aspek target, seperti posisi x, skala, atau transparansi.',
        'One aspect of a target, such as x position, scale, or opacity.',
      ),
    },
  ],
  [
    {
      term: 'tween',
      definition: b(
        'Perubahan bertahap dari satu keadaan ke keadaan lain dalam rentang waktu.',
        'A gradual change from one state to another over time.',
      ),
    },
    {
      term: 'object { }',
      definition: b(
        'Kumpulan pasangan nama dan nilai. Koma memisahkan properti, misalnya { x: 100, duration: 1 }.',
        'A collection of names and values. Commas separate properties, as in { x: 100, duration: 1 }.',
      ),
    },
    {
      term: 'transform',
      definition: b(
        'Perubahan tampilan seperti geser, putar, dan skala yang mempertahankan ruang asli dalam layout.',
        'Visual translation, rotation, and scaling that preserve the original layout space.',
      ),
    },
  ],
  [
    {
      term: 'ease',
      definition: b(
        'Kurva yang mengatur laju perubahan sepanjang tween, seperti mulai cepat lalu melambat.',
        'A curve controlling the rate of change through a tween, such as starting fast then slowing down.',
      ),
    },
    {
      term: 'duration',
      definition: b(
        'Lama satu putaran tween dalam detik. Nilai 0.5 berarti setengah detik.',
        'One tween iteration’s duration in seconds. 0.5 means half a second.',
      ),
    },
    {
      term: 'array [ ]',
      definition: b(
        'Daftar nilai yang berurutan, dipisahkan koma. Keyframes memakai daftar objek.',
        'An ordered list of comma-separated values. Keyframes use a list of objects.',
      ),
    },
  ],
  [
    {
      term: 'timeline',
      definition: b(
        'Wadah untuk menyusun tween dengan satu playhead dan pengendali waktu.',
        'A container sequencing tweens under one playhead and time controller.',
      ),
    },
    {
      term: 'playhead',
      definition: b(
        'Penunjuk waktu yang sedang diperlihatkan. Menggesernya memungkinkan kamu memeriksa keadaan animasi.',
        'The time position currently being displayed. Scrubbing it lets you inspect an animation state.',
      ),
    },
    {
      term: 'position',
      definition: b(
        'Argumen yang menentukan kapan tween ditempatkan di timeline.',
        'The argument determining when a tween is placed in a timeline.',
      ),
    },
  ],
  [
    {
      term: 'event',
      definition: b(
        'Kejadian seperti klik atau fokus yang dapat memicu fungsi.',
        'An occurrence such as a click or focus that can trigger a function.',
      ),
    },
    {
      term: 'callback',
      definition: b(
        'Fungsi yang kamu berikan untuk dipanggil nanti oleh kode lain.',
        'A function supplied for other code to call later.',
      ),
    },
    {
      term: '() => { }',
      definition: b(
        'Bentuk singkat fungsi JavaScript. Kode dalam kurung kurawal berjalan ketika fungsi dipanggil.',
        'A short JavaScript function form. The code in braces runs when the function is called.',
      ),
    },
  ],
  [
    {
      term: 'trigger',
      definition: b(
        'Elemen yang posisinya diamati untuk memulai atau mengatur animasi.',
        'An element whose position is watched to trigger or control an animation.',
      ),
    },
    {
      term: 'scroller',
      definition: b(
        'Area yang digulir. Pada latihan, ini panel preview di kanan.',
        'The scrolling region. In these exercises, it is the preview panel.',
      ),
    },
    {
      term: 'scrub',
      definition: b(
        'Hubungan antara posisi scroll dan progres animasi dalam sebuah rentang.',
        'A link between scroll position and animation progress across a range.',
      ),
    },
  ],
  [
    {
      term: 'viewBox',
      definition: b(
        'Kertas koordinat internal SVG. Empat angkanya menentukan asal dan ukuran area gambar.',
        'The SVG’s internal coordinate sheet. Its four numbers define the origin and drawing area.',
      ),
    },
    {
      term: 'attribute',
      definition: b(
        'Nilai pada tag HTML atau SVG, misalnya r, cx, dan d.',
        'A value on an HTML or SVG tag, such as r, cx, or d.',
      ),
    },
    {
      term: 'path',
      definition: b(
        'Jalur SVG yang dibentuk oleh instruksi dalam atribut d.',
        'An SVG route formed by instructions in the d attribute.',
      ),
    },
  ],
  [
    {
      term: 'scope',
      definition: b(
        'Batas pencarian selector agar animasi hanya memilih elemen di bagian yang ditentukan.',
        'A selector boundary that limits animation targets to a specified section.',
      ),
    },
    {
      term: 'revert',
      definition: b(
        'Memulihkan style sebelum animasi dipasang sekaligus membersihkan animasinya.',
        'Restore styles from before setup and clean up the animation.',
      ),
    },
    {
      term: '? :',
      definition: b(
        'Operator pemilih dua nilai: kondisi ? jikaBenar : jikaSalah.',
        'An operator selecting between two values: condition ? ifTrue : ifFalse.',
      ),
    },
  ],
  [
    {
      term: 'composition',
      definition: b(
        'Menggabungkan beberapa konsep kecil agar satu interaksi utuh mudah dipahami.',
        'Combining small concepts into one understandable interaction.',
      ),
    },
    {
      term: 'replay',
      definition: b(
        'Mengulangi hasil yang sama dari awal tanpa memasang event baru.',
        'Play the same result again from the start without installing another event.',
      ),
    },
    {
      term: 'progress',
      definition: b(
        'Bagian animasi yang sudah ditempuh, dari 0 sampai 1 atau 0% sampai 100%.',
        'The fraction of an animation completed, from 0 to 1 or 0% to 100%.',
      ),
    },
  ],
]
