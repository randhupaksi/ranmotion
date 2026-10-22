import { b } from './types'
import type { Copy, ConceptLesson } from './types'

export interface IntroStudy {
  terms: { title: Copy; explanation: Copy }[]
  question: Copy
  choices: Copy[]
  answer: number
  explanation: Copy
}

export const introStudies: Record<string, IntroStudy> = {
  'gsap-foundations': {
    terms: [
      {
        title: b('HTML: bendanya', 'HTML: the object'),
        explanation: b(
          'HTML menyediakan elemen, misalnya tombol, judul, atau kotak yang kamu lihat di bawah.',
          'HTML supplies elements, such as a button, a heading, or the box below.',
        ),
      },
      {
        title: b('CSS: tampilannya', 'CSS: its appearance'),
        explanation: b(
          'CSS mengatur bentuk, warna, dan posisi awal elemen. CSS juga punya transition dan animation untuk banyak kebutuhan sederhana.',
          'CSS defines the shape, color, and initial position. CSS transitions and animations can also handle many simple animation needs.',
        ),
      },
      {
        title: b('GSAP: pengatur perubahannya', 'GSAP: the change over time'),
        explanation: b(
          'Melalui JavaScript, GSAP mengubah nilai properti sedikit demi sedikit. GSAP berguna ketika kamu ingin mengatur urutan, interaksi, atau kontrol pemutaran yang lebih rinci.',
          'Through JavaScript, GSAP changes property values step by step. It is useful for sequencing, interaction, and more detailed playback controls.',
        ),
      },
    ],
    question: b(
      'Apa peran GSAP pada kotak di percobaan ini?',
      'What does GSAP do to the box in this experiment?',
    ),
    choices: [
      b('Membuat halaman HTML baru', 'Create a new HTML page'),
      b(
        'Mengatur perubahan posisi kotak selama suatu waktu',
        'Control how the box position changes over time',
      ),
      b('Mengirim kotak ke server', 'Send the box to a server'),
    ],
    answer: 1,
    explanation: b(
      'Kotaknya sudah ada sebagai elemen HTML. GSAP mengubah posisi elemen itu dari awal ke tujuan selama waktu yang ditentukan. Inilah ide dasar sebuah tween.',
      'The box already exists as an HTML element. GSAP changes its position from the start to a destination over a chosen duration. This is the basic idea of a tween.',
    ),
  },
  'animation-blueprint': {
    terms: [
      {
        title: b('Target + perubahan', 'Target + change'),
        explanation: b(
          'Tentukan elemen yang dianimasikan dan hal yang berubah. Pada contoh ini, targetnya kotak dan yang berubah adalah posisi horizontalnya.',
          'Choose the element and what changes. Here the target is the box and the changing property is its horizontal position.',
        ),
      },
      {
        title: b('Durasi + easing', 'Duration + easing'),
        explanation: b(
          'Durasi adalah lama animasi, dalam detik. Easing membentuk perubahan kecepatannya. Keduanya tidak mengganti tujuan akhir yang kamu pilih.',
          'Duration is how long the animation lasts, in seconds. Easing shapes its speed along the way. Neither changes the destination you choose.',
        ),
      },
      {
        title: b('Tween → timeline', 'Tween → timeline'),
        explanation: b(
          'Tween adalah satu instruksi perubahan. Timeline merangkai beberapa tween agar urutannya mudah diatur. Kamu akan mempelajari timeline setelah nyaman dengan satu tween.',
          'A tween is one animation instruction. A timeline arranges several tweens into a sequence. You will explore timelines after getting comfortable with a single tween.',
        ),
      },
    ],
    question: b(
      'Tujuan tetap 160 piksel. Jika durasi diubah dari 1 menjadi 2 detik, apa yang berubah?',
      'The destination stays at 160 pixels. If duration changes from 1 to 2 seconds, what changes?',
    ),
    choices: [
      b('Kotak tiba dua kali lebih jauh', 'The box travels twice as far'),
      b('Kotak menjadi dua kali lebih besar', 'The box becomes twice as large'),
      b(
        'Kotak memerlukan waktu lebih lama untuk tiba di tujuan yang sama',
        'The box takes longer to reach the same destination',
      ),
    ],
    answer: 2,
    explanation: b(
      'Jarak dan durasi adalah dua hal terpisah. Dengan jarak tetap, durasi lebih besar membuat kotak menempuh perjalanan yang sama dengan waktu lebih lama. Ubah satu hal setiap kali supaya sebab dan akibatnya terlihat.',
      'Distance and duration are independent. With distance unchanged, a larger duration gives the same journey more time. Change one thing at a time to see cause and effect.',
    ),
  },
}

const shared = {
  format: 'concept' as const,
  module: 0,
  scene: 'box' as const,
}

export const introLessons: ConceptLesson[] = [
  {
    ...shared,
    id: 'gsap-foundations',
    title: b('Kenalan dengan GSAP, tanpa menulis kode', 'Meet GSAP, without writing code'),
    description: b(
      'Pahami apa itu GSAP dan bagaimana elemen web bisa berubah menjadi animasi. Mulai dengan mengamati dan mencoba.',
      'Understand what GSAP is and how a web element becomes an animation. Start by observing and experimenting.',
    ),
    minutes: 5,
    concept: 'GSAP · HTML · CSS · tween',
    objective: b(
      'Menjelaskan peran GSAP dan membedakan elemen, tampilan awal, serta perubahan sepanjang waktu.',
      'Explain GSAP’s role and distinguish the element, its initial appearance, and its change over time.',
    ),
    model: b(
      'Bayangkan kotak sebagai aktor, CSS sebagai penata tampilannya, dan GSAP sebagai pengatur kapan serta bagaimana aktor itu berubah.',
      'Think of the box as an actor, CSS as its appearance, and GSAP as the director of when and how it changes.',
    ),
    explanation: b(
      'GSAP adalah library animasi JavaScript: sekumpulan alat yang bisa kamu pakai untuk mengatur animasi di halaman web. Kamu memberi tahu elemen mana yang berubah, nilai tujuannya, dan waktunya. GSAP menghitung nilai di antaranya. Satu instruksi perubahan ini disebut tween. Di RanMotion, alatnya sudah disiapkan. Kamu tidak perlu memasang apa pun atau menulis kode pada pelajaran ini.',
      'GSAP is a JavaScript animation library: a collection of tools for controlling animation on web pages. You specify the element, its destination values, and the timing. GSAP calculates the values in between. One such animation instruction is called a tween. RanMotion has everything ready. You do not need to install anything or write code in this lesson.',
    ),
    steps: [
      b(
        'Tekan Putar animasi dan bandingkan posisi awal dengan posisi akhir.',
        'Press Play animation and compare the start and end positions.',
      ),
      b(
        'Geser progres untuk melihat keadaan di antara awal dan akhir.',
        'Scrub the progress control to inspect states between the start and finish.',
      ),
      b(
        'Ulangi animasi. Elemen yang sama berubah, bukan diganti dengan kotak baru.',
        'Replay the animation. The same element changes; it is not replaced with a new box.',
      ),
    ],
    mistake: b(
      'GSAP tidak menggantikan HTML atau CSS. Ketiganya bekerja bersama. Kamu juga tidak harus memakai GSAP untuk setiap animasi; pilih alat sesuai kebutuhan.',
      'GSAP does not replace HTML or CSS. They work together. You also do not need GSAP for every animation; choose the tool to suit the task.',
    ),
    recap: [
      b(
        'GSAP adalah alat JavaScript untuk mengatur perubahan sepanjang waktu.',
        'GSAP is a JavaScript tool for controlling changes over time.',
      ),
      b(
        'Tween menghubungkan keadaan awal dengan tujuan.',
        'A tween connects a starting state with a destination.',
      ),
      b(
        'Kamu bisa mulai memahami animasi dengan melihat, memutar ulang, dan membandingkan.',
        'You can begin understanding animation by watching, replaying, and comparing.',
      ),
    ],
  },
  {
    ...shared,
    id: 'animation-blueprint',
    title: b(
      'Rencanakan animasinya sebelum menulis kode',
      'Plan the animation before writing code',
    ),
    description: b(
      'Uraikan sebuah animasi menjadi target, perubahan, durasi, dan easing. Coba semuanya lewat kontrol visual.',
      'Break an animation into a target, a change, a duration, and easing. Explore them with visual controls.',
    ),
    minutes: 6,
    concept: 'target · property · duration · easing',
    objective: b(
      'Membuat rencana animasi sederhana dan membedakan jarak, durasi, serta karakter kecepatannya.',
      'Plan a simple animation and distinguish distance, duration, and the shape of its speed.',
    ),
    model: b(
      'Sebelum memberi instruksi, jawab: benda apa, berubah bagaimana, ke mana, berapa lama, dan terasa seperti apa?',
      'Before giving instructions, ask: which object, what change, which destination, how long, and what should it feel like?',
    ),
    explanation: b(
      'Mulai dengan satu perubahan yang mudah diamati. Kotak adalah targetnya; posisi adalah propertinya. Jarak menentukan tujuan, durasi menentukan lama perjalanan, dan easing menentukan bagaimana kecepatannya berubah. Dalam JavaScript nanti, posisi horizontal disebut x, waktu disebut duration, dan pola kecepatan disebut ease. Tidak perlu menghafal sintaksnya sekarang. Bangun hubungan antara pilihanmu dan hasil yang terlihat dahulu.',
      'Start with one change you can observe. The box is the target; position is its property. Distance sets the destination, duration sets the travel time, and easing shapes how speed changes. Later in JavaScript, horizontal position is x, time is duration, and the speed pattern is ease. You do not need to memorize syntax now. First connect your choices to the visible result.',
    ),
    steps: [
      b(
        'Pertahankan tujuan, lalu bandingkan durasi 1 detik dengan 2 detik.',
        'Keep the destination unchanged and compare durations of 1 and 2 seconds.',
      ),
      b(
        'Pertahankan durasi, lalu ubah tujuan kotak.',
        'Keep the duration unchanged and change the box destination.',
      ),
      b(
        'Bandingkan kecepatan konstan dengan melambat di akhir. Perhatikan bahwa tujuan akhirnya sama.',
        'Compare constant speed with slowing down at the end. Notice the identical destination.',
      ),
    ],
    mistake: b(
      'Durasi lebih besar tidak membuat kotak pergi lebih jauh. Jika tujuan tetap, kotak menempuh jarak yang sama dalam waktu lebih lama.',
      'A larger duration does not make the box travel farther. With the destination unchanged, the box travels the same distance over more time.',
    ),
    recap: [
      b(
        'Target menjawab elemen mana; properti menjawab apa yang berubah.',
        'The target tells us which element; the property tells us what changes.',
      ),
      b(
        'Jarak, durasi, dan easing mengatur hal yang berbeda.',
        'Distance, duration, and easing control different things.',
      ),
      b(
        'Sesudah ini, kamu siap membaca instruksi yang sama di editor.',
        'You are now ready to read these same instructions in the editor.',
      ),
    ],
  },
]
