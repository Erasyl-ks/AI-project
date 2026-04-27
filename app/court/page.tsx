"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Gavel, FileText, Users, ShieldCheck, Clock, CircleDollarSign,
  ArrowRight, Sparkles, Scale, HelpCircle, BookOpen, ChevronDown
} from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import { useLang } from "@/components/LangProvider";
import { mdToHtml } from "@/lib/utils";

const instances = [
  {
    name: { kk: "1-саты", ru: "Первая инстанция", en: "First instance" },
    court: { kk: "Аудандық / қалалық сот", ru: "Районный / городской суд", en: "District / city court" },
    desc: {
      kk: "Істі мәні бойынша қарайды. Куәгерлер, дәлелдер, талап арыз осы жерде.",
      ru: "Рассматривает дело по существу. Свидетели, доказательства, исковое — здесь.",
      en: "Hears the case on its merits. Witnesses, evidence, and the statement of claim are all here."
    },
    icon: Building2
  },
  {
    name: { kk: "Апелляция", ru: "Апелляция", en: "Appeal" },
    court: { kk: "Облыстық сот", ru: "Областной суд", en: "Regional court" },
    desc: {
      kk: "1-саты шешімімен келіспегенде шағымданасыз. Шешім заңды күшіне енгенге дейін.",
      ru: "Обжалование решения 1-й инстанции до вступления в силу.",
      en: "Appealing the first-instance decision before it comes into legal force."
    },
    icon: Gavel
  },
  {
    name: { kk: "Кассация", ru: "Кассация", en: "Cassation" },
    court: { kk: "Жоғарғы Сот", ru: "Верховный Суд", en: "Supreme Court" },
    desc: {
      kk: "Заңды қолдану дұрыстығын тексереді. Қайта дәлелдемейсіз, заң позициясы ғана.",
      ru: "Проверка правильности применения закона, без переоценки доказательств.",
      en: "Checks that the law was applied correctly; evidence is not re-evaluated."
    },
    icon: ShieldCheck
  }
];

const steps = [
  {
    t: { kk: "1 · Дайындық", ru: "1 · Подготовка", en: "1 · Preparation" },
    d: {
      kk: "Дәлелдерді, шарттарды, хат-хабарды, куәлар тізімін жинау. Ықтимал талапты тұжырымдау.",
      ru: "Собрать доказательства, договоры, переписку, список свидетелей. Сформулировать требование.",
      en: "Gather evidence, contracts, correspondence, witness list. Formulate the claim."
    }
  },
  {
    t: { kk: "2 · Талап арыз", ru: "2 · Исковое заявление", en: "2 · Statement of claim" },
    d: {
      kk: "Соттың аты, тараптар, талап мәні, негіздер, баж туралы түбіртек. Қосымшалардың көшірмесі.",
      ru: "Суд, стороны, предмет требования, основания, квитанция о пошлине. Копии приложений.",
      en: "Court name, parties, subject of claim, grounds, receipt for state fee. Copies of attachments."
    }
  },
  {
    t: { kk: "3 · Қабылдау", ru: "3 · Принятие", en: "3 · Acceptance" },
    d: {
      kk: "Сот 5 жұмыс күні ішінде қабылдау туралы ұйғарым шығарады. Кемшіліктер болса — мерзім береді.",
      ru: "Суд в течение 5 рабочих дней выносит определение. При недостатках — даёт срок на устранение.",
      en: "The court issues a ruling within 5 business days. If there are defects, it grants time to fix them."
    }
  },
  {
    t: { kk: "4 · Дайындық отырысы", ru: "4 · Подготовка к слушанию", en: "4 · Pre-trial hearing" },
    d: {
      kk: "Тараптар позицияларын түсіндіреді, дәлелдер бекітіледі, бітімгершілікке шақыру мүмкін.",
      ru: "Стороны излагают позиции, закрепляются доказательства, возможна попытка мирового соглашения.",
      en: "Parties present positions, evidence is fixed, a settlement attempt is possible."
    }
  },
  {
    t: { kk: "5 · Сот отырысы", ru: "5 · Судебное заседание", en: "5 · Court hearing" },
    d: {
      kk: "Талап, қарсылықтар, куәгерлер, жарыссөз. Соңында — шешім немесе үзіліс.",
      ru: "Требования, возражения, свидетели, прения. В финале — решение либо перерыв.",
      en: "Claims, objections, witnesses, closing arguments. Ends with a decision or recess."
    }
  },
  {
    t: { kk: "6 · Шешім", ru: "6 · Решение", en: "6 · Decision" },
    d: {
      kk: "Шешім жарияланады, толық мәтіні кейін беріледі. Шағым мерзімін жазып алыңыз.",
      ru: "Оглашается решение, полный текст — позже. Запишите срок на обжалование.",
      en: "The decision is announced; the full text follows later. Note the appeal deadline."
    }
  }
];

const roles = [
  {
    icon: Users,
    name: { kk: "Талапкер", ru: "Истец", en: "Plaintiff" },
    rights: {
      kk: "Талабын өзгерту, дәлелдерді ұсыну, куәгерлерді шақыру, бітім жасасу.",
      ru: "Менять требование, представлять доказательства, вызывать свидетелей, заключать мировое.",
      en: "Amend the claim, present evidence, call witnesses, enter a settlement."
    }
  },
  {
    icon: Users,
    name: { kk: "Жауапкер", ru: "Ответчик", en: "Defendant" },
    rights: {
      kk: "Қарсы талап қою, дәлел келтіру, адвокат жалдау, шешімге шағым.",
      ru: "Подать встречный иск, представить доказательства, нанять адвоката, обжаловать.",
      en: "File a counterclaim, present evidence, hire a lawyer, appeal the decision."
    }
  },
  {
    icon: Users,
    name: { kk: "Куәгер", ru: "Свидетель", en: "Witness" },
    rights: {
      kk: "Өзі, жұбайы, жақын туыстары қарсы куәлік бермеуге құқылы. Тек шындық айтуға тиіс.",
      ru: "Имеет право не свидетельствовать против себя и близких родственников. Обязан говорить правду.",
      en: "May refuse to testify against oneself and close relatives. Must tell the truth."
    }
  },
  {
    icon: Users,
    name: { kk: "Айыпталушы", ru: "Обвиняемый", en: "Accused" },
    rights: {
      kk: "Үнсіз қалу, адвокат жалдау, айыпты білу, дәлелдерді таныстыру, шағымдану.",
      ru: "Молчать, нанять адвоката, знать обвинение, знакомиться с доказательствами, обжаловать.",
      en: "Remain silent, hire a lawyer, know the charges, review evidence, file appeals."
    }
  }
];

const faq = {
  kk: [
    {
      q: "Талап арызды қалай дұрыс жазуға болады?",
      a: "Соттың аты, тараптардың толық деректері, талап мәні (нені талап етесіз), негіздері (неге — заң қағидасы мен фактілер), дәлелдер тізімі, мемлекеттік баж туралы түбіртек, қол, күні. Әр қосымшадан көшірмелер жасаңыз."
    },
    {
      q: "Сотқа барғанда қалай ұстанған жөн?",
      a: "Судьяға \"Құрметті сот\" деп жүгініңіз. Тұрып сөйлеңіз. Ауыздықсыз, фактіге сүйеніп жауап беріңіз. Басқа тарапты бөлмеңіз. Эмоцияға берілмеңіз — ол сіздің позицияңызды әлсіретеді."
    },
    {
      q: "Адвокатсыз сотқа шығуға бола ма?",
      a: "Азаматтық істерде — иә, бірақ тәуекелді. Қылмыстық істе — аса күрделі істерде адвокат қатысуы міндетті. Төлей алмасаңыз, тегін заң көмегі туралы өтініш жазуға болады."
    },
    {
      q: "Сот шешімімен келіспесем?",
      a: "Апелляциялық шағым беріңіз. Әдетте 1 ай шектеулі мерзім. Шешімнің нақты тұстарын көрсетіп, заң бұзушылықты атап өтіңіз. Кассацияға өту — апелляция аяқталғаннан кейін."
    },
    {
      q: "Мемлекеттік баж қанша?",
      a: "Азаматтық талаптарда талап сомасынан пайызбен есептеледі. Моральдық зиян өтемінен белгіленген мөлшерде. Дәл сомасын сот кеңсесінен немесе egov.kz арқылы тексеріңіз."
    }
  ],
  ru: [
    {
      q: "Как правильно составить исковое заявление?",
      a: "Название суда, реквизиты сторон, предмет требования (что требуете), основания (почему — норма права и факты), перечень доказательств, квитанция пошлины, подпись и дата. Сделайте копии приложений по числу сторон."
    },
    {
      q: "Как вести себя в суде?",
      a: "Обращайтесь «Уважаемый суд». Говорите стоя. Отвечайте по существу, без эмоций. Не перебивайте другую сторону. Эмоциональные выпады ослабляют вашу позицию — держитесь фактов."
    },
    {
      q: "Можно ли идти в суд без адвоката?",
      a: "По гражданским делам — да, но это риск. По уголовным — в сложных делах участие адвоката обязательно. Если не можете оплатить — подайте заявление на бесплатную юридическую помощь."
    },
    {
      q: "Что делать, если не согласен с решением?",
      a: "Подать апелляционную жалобу. Срок обычно ограничен 1 месяцем. Укажите конкретные пункты решения и нарушения закона. В кассацию — после завершения апелляции."
    },
    {
      q: "Сколько стоит госпошлина?",
      a: "По гражданским искам — процент от цены иска. По моральному вреду — фиксированная сумма. Точные размеры уточняйте в канцелярии суда или на egov.kz."
    }
  ],
  en: [
    {
      q: "How do I correctly draft a statement of claim?",
      a: "Court name, full details of the parties, subject of the claim (what you're demanding), grounds (why — legal principle and facts), list of evidence, receipt for the state fee, signature, and date. Make copies of attachments for all parties."
    },
    {
      q: "How should I behave in court?",
      a: "Address the judge as \"Your Honor.\" Stand when speaking. Answer factually, without emotion. Don't interrupt the other party. Emotional outbursts weaken your position — stick to the facts."
    },
    {
      q: "Can I go to court without a lawyer?",
      a: "In civil cases — yes, but risky. In criminal cases, a lawyer is mandatory for complex matters. If you can't afford one, you can apply for free legal aid."
    },
    {
      q: "What if I disagree with the decision?",
      a: "File an appeal. The deadline is usually 1 month. Point to specific parts of the decision and cite the legal violations. Cassation follows after the appeal is concluded."
    },
    {
      q: "How much is the state fee?",
      a: "For civil claims, it's a percentage of the claim amount. For moral damages, a fixed sum. Check the exact amount at the court clerk or on egov.kz."
    }
  ]
};

export default function CourtPage() {
  const { lang } = useLang();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ask = async () => {
    const q = question.trim();
    if (q.length < 4 || busy) return;
    setBusy(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lang,
          mode: "court",
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      setAnswer(
        data.reply || (lang === "kk" ? "Ақпарат жеткіліксіз." : lang === "ru" ? "Недостаточно информации." : "Insufficient information.")
      );
    } catch {
      setAnswer(lang === "kk" ? "Қате шықты." : lang === "ru" ? "Ошибка запроса." : "Request failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hero-bg">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zan-600/10">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="container-zan relative py-14 md:py-20">
          <span className="chip"><Building2 size={12} /> {lang === "kk" ? "Сот жүйесі" : lang === "ru" ? "Судебная система" : "Court system"}</span>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-zan-ink md:text-5xl">
            {lang === "kk" ? (
              <>Қазақстанның <span className="text-zan-600">сот жүйесі</span> — адам тілімен.</>
            ) : lang === "ru" ? (
              <>Судебная <span className="text-zan-600">система Казахстана</span> — человеческим языком.</>
            ) : (
              <>Kazakhstan's <span className="text-zan-600">court system</span> — in plain language.</>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zan-ink/70">
            {lang === "kk"
              ? "Сот сатылары, талап арыз, апелляция, кассация, тараптардың құқықтары — бір бетте, қысқа және түсінікті."
              : lang === "ru"
              ? "Инстанции, иск, апелляция, кассация, права сторон — на одной странице, коротко и ясно."
              : "Court instances, claims, appeals, cassation, the rights of parties — on one page, short and clear."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/judge" className="btn-primary">
              <Gavel size={16} />
              {lang === "kk" ? "Судья режимі" : lang === "ru" ? "Режим судьи" : "Judge mode"}
            </Link>
            <Link href="/chat" className="btn-ghost">
              <HelpCircle size={16} />
              {lang === "kk" ? "Менің ісім туралы сұрау" : lang === "ru" ? "Спросить про моё дело" : "Ask about my case"}
            </Link>
          </div>
        </div>
      </section>

      {/* INSTANCES */}
      <section className="container-zan py-14">
        <h2 className="font-display text-2xl font-bold text-zan-ink md:text-3xl">
          {lang === "kk" ? "Сот сатылары" : lang === "ru" ? "Судебные инстанции" : "Court instances"}
        </h2>
        <p className="mt-2 text-sm text-zan-ink/60">
          {lang === "kk"
            ? "Іс қалай қозғалады: 1-саты → апелляция → кассация."
            : lang === "ru"
            ? "Как движется дело: 1-я → апелляция → кассация."
            : "How a case moves: 1st instance → appeal → cassation."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {instances.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="card card-hover relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-zan-50" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zan-600 text-white">
                    <Icon size={18} />
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-zan-600">
                    {it.name[lang]}
                  </div>
                  <div className="font-display text-lg font-bold text-zan-ink">
                    {it.court[lang]}
                  </div>
                  <p className="mt-2 text-sm text-zan-ink/70">{it.desc[lang]}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* STEPS */}
      <section className="container-zan pb-14">
        <h2 className="font-display text-2xl font-bold text-zan-ink md:text-3xl">
          {lang === "kk" ? "Процесс қадамдары" : lang === "ru" ? "Шаги процесса" : "Process steps"}
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative rounded-2xl border border-zan-600/10 bg-white p-5"
            >
              <div className="absolute -left-0.5 top-5 h-6 w-1 rounded-r-full bg-zan-600" />
              <div className="font-display text-base font-bold text-zan-700">{s.t[lang]}</div>
              <p className="mt-1.5 text-sm text-zan-ink/75">{s.d[lang]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="bg-white">
        <div className="container-zan py-14">
          <h2 className="font-display text-2xl font-bold text-zan-ink md:text-3xl">
            {lang === "kk" ? "Тараптар және құқықтары" : lang === "ru" ? "Стороны и их права" : "Parties and their rights"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card card-hover"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zan-50 text-zan-600">
                    <Icon size={18} />
                  </div>
                  <div className="mt-4 font-display text-base font-bold text-zan-ink">{r.name[lang]}</div>
                  <p className="mt-1 text-sm text-zan-ink/70">{r.rights[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="container-zan py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <QuickFact
            icon={Clock}
            title={lang === "kk" ? "Шағым мерзімі" : lang === "ru" ? "Срок обжалования" : "Appeal deadline"}
            value={lang === "kk" ? "әдетте 1 ай" : lang === "ru" ? "обычно 1 месяц" : "usually 1 month"}
            note={lang === "kk" ? "Іс түріне байланысты өзгереді" : lang === "ru" ? "Зависит от типа дела" : "Varies by case type"}
          />
          <QuickFact
            icon={CircleDollarSign}
            title={lang === "kk" ? "Мемлекеттік баж" : lang === "ru" ? "Госпошлина" : "State fee"}
            value={lang === "kk" ? "МЕК % / белгіленген" : lang === "ru" ? "% от цены / фиксир." : "% of claim / fixed"}
            note="egov.kz"
          />
          <QuickFact
            icon={BookOpen}
            title={lang === "kk" ? "Негізгі кодекстер" : lang === "ru" ? "Основные кодексы" : "Main codes"}
            value="ГК · ГПК · УК · УПК · КоАП"
            note={lang === "kk" ? "қолданылатын норма түріне қарай" : lang === "ru" ? "в зависимости от дела" : "depending on the case"}
          />
        </div>
      </section>

      {/* ASK ZAN */}
      <section className="container-zan pb-14">
        <div className="relative overflow-hidden rounded-3xl border border-zan-600/10 bg-gradient-to-br from-zan-600 to-zan-700 p-6 text-white md:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <Sparkles size={14} /> {lang === "kk" ? "Сотқа қатысты сұрағыңыз бар ма?" : lang === "ru" ? "Есть вопрос по суду?" : "Got a court question?"}
          </div>
          <h3 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">
            {lang === "kk"
              ? "Сұрақты жазыңыз — zan.kz сот тілімен жауап береді."
              : lang === "ru"
              ? "Задайте вопрос — zan.kz ответит на языке суда."
              : "Ask a question — zan.kz will answer in the language of the court."}
          </h3>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder={
                lang === "kk"
                  ? "Мысалы: талап арызды қалай жазу керек?"
                  : lang === "ru"
                  ? "Например: как составить исковое заявление?"
                  : "For example: how do I draft a statement of claim?"
              }
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={ask}
              disabled={busy || question.trim().length < 4}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zan-700 shadow-soft transition hover:bg-zan-50 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  {lang === "kk" ? "Ойлануда…" : lang === "ru" ? "Думаю…" : "Thinking…"}
                </>
              ) : (
                <>
                  <Scale size={16} />
                  {lang === "kk" ? "Сұрау" : lang === "ru" ? "Спросить" : "Ask"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-2xl bg-white p-5 text-zan-ink"
              >
                <div
                  className="prose-zan"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(answer) }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-zan pb-20">
        <h2 className="font-display text-2xl font-bold text-zan-ink md:text-3xl">FAQ</h2>
        <div className="mt-6 space-y-2">
          {faq[lang].map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}

function QuickFact({
  icon: Icon, title, value, note
}: {
  icon: typeof Clock; title: string; value: string; note: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="card card-hover"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zan-600 text-white">
        <Icon size={18} />
      </div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-zan-600">{title}</div>
      <div className="font-display text-xl font-extrabold text-zan-ink">{value}</div>
      <div className="text-xs text-zan-ink/60">{note}</div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-zan-600/10 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-zan-ink">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zan-600"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-zan-ink/75">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
