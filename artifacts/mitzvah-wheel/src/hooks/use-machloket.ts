// Halachic opinions and disputes (machloket) for the mitzvot
// Authorities cited: Rambam, Ramban, Rashi, Tosafot, Sefer HaChinuch,
// Tur, Shulchan Aruch, Rema, Ritva, Ran, Ba'al HaMaor, Ra'avad, and others.

export type MachloketOpinion = {
  authority: string;
  position: string;
  source?: string;
};

export const MACHLOKET: Record<string, MachloketOpinion[]> = {

  // ── EMUNAH & YESODOT ───────────────────────────────────────────────────────

  "Believe in God's existence": [
    { authority: "Rambam", position: "This is a positive mitzvah — one is obligated to know that God exists, that He is the First Cause, and that He brought all existence into being.", source: "Sefer HaMitzvot PM #1; Hilchot Yesodei HaTorah 1:1" },
    { authority: "Ramban", position: "Questions whether belief can be commanded at all. The verse 'I am the Lord your God' is not a command — it is the preface that establishes the authority behind all commands. One cannot be commanded to believe in the Commander.", source: "Hasagot on Sefer HaMitzvot, Shoresh 1" },
    { authority: "Sefer HaChinuch", position: "Agrees with Rambam that this is a positive mitzvah. Belief is attained through contemplation of creation and study of Torah. One who reflects deeply on the world will naturally arrive at certainty of God's existence.", source: "Chinuch #25" },
    { authority: "Ra'avad", position: "Belief itself cannot be legislated, but the obligation to study and affirm God's existence through ongoing investigation is a genuine mitzvah.", source: "Hassagot to Mishneh Torah, Yesodei HaTorah" },
  ],

  "Accept God's complete unity": [
    { authority: "Rambam", position: "God's unity is unlike any numerical unity — He is One without any multiplicity, division, or parallel. Even the word 'one' is used only metaphorically, since He has no attributes distinct from His essence.", source: "Hilchot Yesodei HaTorah 1:7; Moreh Nevuchim 1:50" },
    { authority: "Ramban", position: "The mystery of divine unity cannot be fully grasped by the human mind. We affirm that He is one, but the nature of that unity surpasses all intellectual categories.", source: "Commentary on Shema, Devarim 6:4" },
    { authority: "Tosafot", position: "The Shema declaration fulfills this mitzvah. The word 'echad' implies God's sovereignty over all directions and realms — above, below, and the four cardinal points.", source: "Tosafot, Berakhot 13b" },
    { authority: "Sefer HaChinuch", position: "We are obligated to know this clearly and to contemplate it continually. The practical expression is the daily Shema declaration.", source: "Chinuch #417" },
  ],

  "Love God with all your heart": [
    { authority: "Rambam", position: "Love of God is produced by contemplating His works and creations. The more one studies nature and Torah, the more one will love Him. This love should be all-consuming — as strong as the love a lover feels.", source: "Hilchot Teshuvah 10:6; Hilchot Yesodei HaTorah 2:2" },
    { authority: "Ramban", position: "Love of God is fundamentally expressed through joyful observance of His mitzvot. One who does mitzvot with love, not fear, fulfills this command fully.", source: "Ramban on Devarim 6:5" },
    { authority: "Rashi", position: "'With all your heart' means with both your yetzer tov and yetzer hara — channeling even your drives toward serving God.", source: "Rashi on Devarim 6:5" },
    { authority: "Sefer HaChinuch", position: "The obligation is to love God constantly and to ensure that all actions are motivated by love rather than fear. One who loves God fulfills all mitzvot more completely.", source: "Chinuch #418" },
  ],

  "Fear and revere God": [
    { authority: "Rambam", position: "Fear (yirah) and love (ahavah) are two distinct mitzvot and two distinct states. Fear is produced when one contemplates how tiny and insignificant one is before the infinite Creator.", source: "Hilchot Yesodei HaTorah 2:2; Sefer HaMitzvot PM #4" },
    { authority: "Ramban", position: "The fear commanded here is specifically 'yirat haromemus' — awe of God's majesty — not merely fear of punishment. It is higher than ordinary fear.", source: "Ramban on Devarim 6:13" },
    { authority: "Sefer HaChinuch", position: "This mitzvah is fulfilled by behaving with constant reverence — not speaking frivolously in God's name, not treating His Torah lightly, and remembering at all times that He sees all.", source: "Chinuch #432" },
    { authority: "Tur / Shulchan Aruch", position: "The practical obligation is not to sin even in private, knowing God observes all hidden acts. Shulchan Aruch opens with this awareness as foundational to all halachic practice.", source: "SA OC 1:1 (Rema)" },
  ],

  "Sanctify God's name publicly": [
    { authority: "Rambam", position: "When a Jew is compelled to violate any law under threat of death, he must surrender his life rather than transgress the three cardinal sins (idolatry, sexual immorality, murder). For other laws, in private one may transgress to save one's life, but in public (before ten Jews) one must die rather than transgress.", source: "Hilchot Yesodei HaTorah 5:1-4" },
    { authority: "Ramban", position: "The boundary between when one must die and when one may transgress involves a complex calculus of publicity, persistence of the oppressor's decrees, and the specific sin at issue.", source: "Torat Ha'adam; Milhemet Hashem" },
    { authority: "Ra'avad", position: "Disputes Rambam on the definition of 'public' — whether ten Jews must be present or whether it suffices that the act will become publicly known.", source: "Hassagot on Hilchot Yesodei HaTorah 5:2" },
  ],

  "Study Torah day and night": [
    { authority: "Rambam", position: "Every Jewish man is obligated to study Torah — even if poor, even if a day laborer. He must study at night and during the day. One must set fixed times for study that cannot be interrupted.", source: "Hilchot Talmud Torah 1:8" },
    { authority: "Ramban", position: "While women are exempt from fixed Torah study as a time-bound mitzvah, they are obligated to learn the laws applicable to them.", source: "Ramban on Kiddushin 29b" },
    { authority: "Tosafot", position: "The obligation is fulfilled by even a single verse or single halacha each day. Ideally one should study constantly, but even minimal daily study satisfies the minimal obligation.", source: "Tosafot, Menachot 99b" },
    { authority: "Sefer HaChinuch", position: "Torah study is the greatest of all mitzvot because it leads to all others. One who studies but does not practice is worse than one who practices without study.", source: "Chinuch #419" },
  ],

  // ── TEFILLIN & MEZUZAH ────────────────────────────────────────────────────

  "Wear tefillin on the arm": [
    { authority: "Rashi", position: "The four Torah passages in the arm tefillin are arranged in their order as they appear in the Torah: Kadesh, VeHaya ki yevi'acha, Shema, VeHaya im shamo'a.", source: "Rashi, Menachot 34b" },
    { authority: "Rabbeinu Tam", position: "The order of the passages differs from Rashi: the last two passages are switched, placing VeHaya im shamo'a before Shema. This is the famous machloket between Rashi and Rabbeinu Tam tefillin.", source: "Rabbeinu Tam, Sefer HaYashar; Tosafot Menachot 34b" },
    { authority: "Rambam", position: "Rules like Rashi's order. Only one pair of tefillin is obligatory.", source: "Hilchot Tefillin 3:5" },
    { authority: "Ari z\"l / Minhag", position: "Because of the unresolved dispute, many Ashkenazic men of great piety wear both Rashi and Rabbeinu Tam tefillin (without a blessing on the second pair).", source: "Magen Avraham, OC 34; Kitzur Shulchan Aruch 10:19" },
    { authority: "Sefer HaChinuch", position: "The obligation to wear tefillin applies every day except Shabbat and Yom Tov (when Shabbat itself is a sign). The minimum wearing time is enough to say 'Blessed is His glorious name.'", source: "Chinuch #421" },
  ],

  "Wear tefillin on the head": [
    { authority: "Rambam", position: "The head tefillin must have a shin (letter) embossed on both sides — a three-pronged shin on the right and a four-pronged shin on the left. A tefillin missing either shin is invalid.", source: "Hilchot Tefillin 2:4" },
    { authority: "Ra'avad", position: "Disputes the exact specification of the four-pronged shin — only one shin is mentioned in any standard halachic source.", source: "Hassagot on Hilchot Tefillin 2:4" },
    { authority: "Tosafot", position: "The head tefillin requires four separate compartments, each containing one of the four Torah passages. They must be placed exactly in the center of the head, above the hairline.", source: "Tosafot, Menachot 35a" },
    { authority: "Shulchan Aruch", position: "Women are exempt from tefillin because it is a time-bound positive mitzvah (the verse says 'from day to day,' implying daytime obligation). Michal bat Kushi wore tefillin, but the Sages did not object to her (Eruvin 96a).", source: "SA OC 38:3; Rema 38:3" },
  ],

  "Affix a mezuzah to every doorpost": [
    { authority: "Rashi", position: "The mezuzah scroll must be rolled vertically (upright), and fixed in this vertical position on the doorpost.", source: "Rashi, Menachot 33a" },
    { authority: "Rabbeinu Tam", position: "The mezuzah must be placed horizontally — lying flat on its side on the doorpost.", source: "Rabbeinu Tam cited in Tosafot, Menachot 33a" },
    { authority: "Ran", position: "Proposes the famous compromise: place the mezuzah diagonally, with the top inclined slightly inward, satisfying both opinions.", source: "Ran on Menachot 33a" },
    { authority: "Rambam", position: "The mezuzah is placed vertically (like Rashi). It is affixed within the outer third of the doorway on the right side when entering.", source: "Hilchot Mezuzah 6:1-2" },
    { authority: "Shulchan Aruch / Rema", position: "SA rules like Rambam (vertical). Rema rules in favor of the diagonal compromise (following Ran). Today: Ashkenazim place diagonally; Sephardim place vertically.", source: "SA YD 289:6; Rema YD 289:6" },
    { authority: "Sefer HaChinuch", position: "A doorway requires a mezuzah if it has: a roof, two doorposts, and a threshold, and is at least 10 tefachim high and 4 tefachim wide. Disputed which rooms in a house are obligated.", source: "Chinuch #423" },
  ],

  // ── SHEMA ─────────────────────────────────────────────────────────────────

  "Recite the Shema morning and evening": [
    { authority: "Rambam", position: "The first verse of Shema requires intent (kavvanah). The rest is valid even if recited without complete concentration. One must not recite Shema while in an impure state.", source: "Hilchot Keriat Shema 2:1, 4:1" },
    { authority: "Ramban", position: "All of Shema — including the three paragraphs — requires at minimum awareness that one is fulfilling the mitzvah.", source: "Ramban, Berakhot 13b" },
    { authority: "Rashi", position: "The Shema may be recited in any language one understands. The verse 'hear O Israel' means that one must hear the words as they are said.", source: "Rashi, Berakhot 45a" },
    { authority: "Tosafot", position: "Debates whether one who did not hear the words (e.g., said them silently) has fulfilled the obligation. Concludes that be-di'avad (post facto) one has fulfilled it even without hearing the words.", source: "Tosafot, Berakhot 15a" },
    { authority: "Sefer HaChinuch", position: "The evening Shema is obligated from nightfall (tzet hakochavim); the morning Shema from dawn (amdut hashachar). Both have specific times by which they must be completed.", source: "Chinuch #420" },
    { authority: "Shulchan Aruch", position: "Morning Shema must be recited before the end of the third halachic hour of the day. Evening Shema may be recited from nightfall until dawn.", source: "SA OC 58:1; 235:1" },
  ],

  // ── SHABBAT ──────────────────────────────────────────────────────────────

  "Rest on the Shabbat": [
    { authority: "Rambam", position: "The Torah prohibits 39 categories of labor (melachot), all derived from the labors of the Mishkan. Rabbinic extensions (shevut) are a separate, additional layer of protection.", source: "Hilchot Shabbat 1:1; 7:1" },
    { authority: "Ramban", position: "Some actions Rambam classifies as rabbinic may actually be biblically prohibited under the general prohibition of 'do not do any work.' The concept of uvda d'chol (weekday acts) is more extensive than Rambam acknowledges.", source: "Ramban on Shabbat; Milhemet Hashem" },
    { authority: "Ra'avad", position: "Disputes Rambam on which specific actions constitute complete biblical labors versus partial labors (melachah sh'einah tzerichah legufah).", source: "Hassagot on Hilchot Shabbat 1:7" },
    { authority: "Sefer HaChinuch", position: "Shabbat rest is the sign of the covenant between God and Israel. The prohibition is not merely passive — one is also obligated to honor it actively through speech, clothing, and the joy of Shabbat.", source: "Chinuch #32, #85" },
    { authority: "Ritva", position: "A Jew who violates Shabbat publicly is treated as a non-Jew for certain halachic purposes because Shabbat is the public declaration of Jewish faith in Creation.", source: "Ritva, Eruvin 69a" },
  ],

  "Honor the Shabbat through speech (Kiddush)": [
    { authority: "Rambam", position: "Kiddush is a biblical obligation derived from 'remember the Shabbat day to sanctify it' — one must sanctify it with words. Kiddush on wine is rabbinically required; the biblical mitzvah can be fulfilled with words alone.", source: "Hilchot Shabbat 29:1-6" },
    { authority: "Ramban", position: "The biblical mitzvah requires Kiddush specifically on wine. The verse implies recalling Shabbat through something of significance, which is wine.", source: "Ramban cited in Magid Mishneh, Hilchot Shabbat 29:6" },
    { authority: "Tosafot", position: "Disputes whether bread (challah) may substitute for wine at Kiddush. Concludes that wine is preferred but bread may substitute if wine is unavailable.", source: "Tosafot, Pesachim 106a" },
    { authority: "Shulchan Aruch", position: "Kiddush must be recited where one will eat. One who makes Kiddush in one place and eats in another has not fulfilled the obligation.", source: "SA OC 273:1" },
  ],

  "Kindle Shabbat lights before sunset Friday": [
    { authority: "Rambam", position: "Lighting Shabbat candles is a rabbinic obligation instituted for shalom bayit (domestic peace) and oneg Shabbat (Shabbat pleasure). The woman of the house lights, since she manages the home.", source: "Hilchot Shabbat 5:1-3" },
    { authority: "Ra'avad", position: "Disputes whether the obligation falls primarily on the woman or equally on the man. Both are obligated; the woman typically performs it.", source: "Hassagot on Hilchot Shabbat 5:3" },
    { authority: "Sefer HaChinuch", position: "Though rabbinic, this enactment carries great weight. A woman who habitually neglects candle lighting is warned and may face severe consequences.", source: "Chinuch #85" },
    { authority: "Rema", position: "Women accept Shabbat upon themselves when they light the candles. After lighting, they may not perform any Shabbat-forbidden labor even if it is technically before sunset.", source: "Rema, SA OC 263:10" },
    { authority: "Tosafot", position: "Debates whether men who live alone are equally obligated to light Shabbat candles. Concludes yes — the obligation falls on every household.", source: "Tosafot, Shabbat 25b" },
  ],

  // ── PESACH ────────────────────────────────────────────────────────────────

  "Eat matzah on the first night of Passover": [
    { authority: "Rambam", position: "Eating matzah is biblically obligatory only on the first night of Passover. For the remaining six days, matzah is optional (one simply may not eat chametz).", source: "Hilchot Chametz uMatzah 6:1" },
    { authority: "Ramban", position: "Disputes Rambam. The obligation to eat matzah extends throughout all seven days of Pesach, based on the verse 'seven days you shall eat matzot.'", source: "Milhemet Hashem on Pesachim" },
    { authority: "Ra'avad", position: "Sides with the position that the seven-day verse is an obligation, contradicting Rambam's reading.", source: "Hassagot on Hilchot Chametz uMatzah 6:1" },
    { authority: "Tosafot", position: "Today, when there is no korban Pesach, one might argue the matzah obligation no longer applies — but the Talmud rejects this. One is still biblically obligated to eat matzah on the first night.", source: "Tosafot, Pesachim 120a" },
    { authority: "Sefer HaChinuch", position: "One must eat a kazayit (olive's worth) of matzah at the Seder. The matzah recalls the slavery in Egypt and the hasty departure that left no time for bread to rise.", source: "Chinuch #482" },
  ],

  "Remove all chametz before Passover": [
    { authority: "Rambam", position: "The biblical command is to destroy all chametz before Passover. The Sages added the requirement of bedikat chametz (candle-lit search) the night before, to ensure complete removal.", source: "Hilchot Chametz uMatzah 2:1-3" },
    { authority: "Ra'avad", position: "Disputes whether bittul (nullification of chametz in the heart) alone suffices biblically. Rambam requires physical removal; Ra'avad holds nullification alone may be biblically adequate.", source: "Hassagot on Hilchot Chametz uMatzah 2:2" },
    { authority: "Tosafot", position: "The requirement to check is rabbinic; the biblical obligation is simply not to own chametz. One who nullifies chametz without checking has fulfilled the biblical requirement.", source: "Tosafot, Pesachim 2a" },
    { authority: "Shulchan Aruch", position: "One must search for chametz by candlelight on the night of the 14th of Nisan, nullify all chametz in the morning, and burn the chametz before the fifth halachic hour.", source: "SA OC 431-434" },
  ],

  "Tell the Exodus story on Passover night (Seder)": [
    { authority: "Rambam", position: "One is obligated to speak about the Exodus at length, even if all participants are scholars. The more one expands the account, the more praiseworthy.", source: "Hilchot Chametz uMatzah 7:1-4" },
    { authority: "Sefer HaChinuch", position: "The obligation extends beyond reciting the Haggadah — one must connect the story to the current generation as if they personally left Egypt.", source: "Chinuch #21" },
    { authority: "Ra'avad", position: "Children must participate actively in the Seder to fulfill the aspect of 'in order that you tell your children.'", source: "Hassagot on Hilchot Chametz uMatzah 7:3" },
    { authority: "Tosafot", position: "Debates whether the biblical mitzvah of sipur yetziat Mitzrayim (telling the story) applies only at night or also during the day.", source: "Tosafot, Pesachim 117a" },
  ],

  // ── YOM KIPPUR ────────────────────────────────────────────────────────────

  "Fast and afflict yourself on Yom Kippur": [
    { authority: "Rambam", position: "The five afflictions on Yom Kippur (no eating, no drinking, no washing, no anointing, no marital relations, no leather shoes) are all biblical. Eating on Yom Kippur carries the penalty of karet.", source: "Hilchot Shevitat Asor 1:4-5" },
    { authority: "Ramban", position: "The central prohibition is eating and drinking; the other four afflictions are rabbinically extended from the main prohibition.", source: "Ramban on Vayikra 23:27" },
    { authority: "Ra'avad", position: "Washing and anointing are fully biblical, not merely rabbinic, based on 'and you shall afflict your souls.'", source: "Hassagot on Hilchot Shevitat Asor 1:5" },
    { authority: "Sefer HaChinuch", position: "A child who has reached chinuch age (old enough to understand fasting) should fast part of the day, as a training obligation.", source: "Chinuch #313, #316" },
    { authority: "Shulchan Aruch", position: "A sick person whose doctor determines fasting is dangerous must not fast. Pikuach nefesh (saving a life) overrides Yom Kippur. One who eats to stay alive should eat in small increments.", source: "SA OC 618:1" },
  ],

  // ── SUKKOT ────────────────────────────────────────────────────────────────

  "Dwell in the sukkah during Sukkot": [
    { authority: "Rambam", position: "The obligation to 'dwell' in the sukkah means to eat, sleep, and spend leisure time there — treating the sukkah as one's home for seven days.", source: "Hilchot Sukkah 6:5-6" },
    { authority: "Beit Shammai", position: "A sukkah must be large enough to hold the majority of one's household furniture — it must be a genuine dwelling space.", source: "Mishnah Sukkah 2:7" },
    { authority: "Beit Hillel", position: "A sukkah need only hold one's head, most of one's body, and a small table — the minimum necessary for a symbolic dwelling. Halacha follows Beit Hillel.", source: "Mishnah Sukkah 2:7; Gemara Sukkah 28a" },
    { authority: "Tosafot", position: "One who is uncomfortable in the sukkah due to rain is exempt from the obligation — like a servant whose master pours him a cup and the servant pours it back over the master's face.", source: "Tosafot, Sukkah 29a" },
    { authority: "Ran", position: "Sleeping in the sukkah is a biblical obligation on par with eating there. One cannot excuse themselves from sleeping in the sukkah unless genuinely uncomfortable.", source: "Ran on Sukkah" },
    { authority: "Rema", position: "Ashkenazic custom: if it rains, one may return to the house and does not need to eat in the sukkah at all. Sephardic custom follows stricter standards.", source: "Rema, SA OC 639:5" },
  ],

  "Take the four species on Sukkot": [
    { authority: "Rambam", position: "The four species must be beautiful (hadar) and complete — a lulav without a central spine is invalid; an etrog with its pitom missing at the base is invalid.", source: "Hilchot Lulav 7:1-8" },
    { authority: "Ra'avad", position: "Disputes several of Rambam's disqualifications of the etrog — specifically around the pitom and blemishes.", source: "Hassagot on Hilchot Lulav 7:5" },
    { authority: "Tosafot", position: "Women are exempt from the four species (time-bound positive mitzvah) but may take them without a blessing. Some rishonim say they should not say a blessing.", source: "Tosafot, Sukkah 38a" },
    { authority: "Sefer HaChinuch", position: "The four species represent four types of Jews: the etrog (fragrance and taste = Torah and good deeds), lulav (taste but no fragrance = Torah without deeds), hadas (fragrance without taste = deeds without Torah), aravah (neither = no Torah or deeds). We bind them all together to atone for all.", source: "Chinuch #285" },
  ],

  // ── SHOFAR ────────────────────────────────────────────────────────────────

  "Blow the shofar on Rosh Hashanah": [
    { authority: "Rambam", position: "The biblical mitzvah requires blowing a teruah — a wavering, broken sound. The tekiah-teruah-tekiah sequence is the minimum biblical requirement.", source: "Hilchot Shofar 3:1-3" },
    { authority: "Tosafot", position: "There is a dispute in the Talmud about the precise sound of the teruah. Because of this uncertainty, we blow three different types (shevarim-teruah, shevarim alone, teruah alone) to cover all opinions.", source: "Tosafot, Rosh Hashanah 33b-34a" },
    { authority: "Ra'avad", position: "The ancient teruah was yevavot — a series of short broken sounds. The shevarim (long broken sounds) are a separate, uncertain fulfillment.", source: "Hassagot on Hilchot Shofar 3:3" },
    { authority: "Sefer HaChinuch", position: "The sound of the shofar is meant to awaken the heart from spiritual slumber, to recall the binding of Isaac, and to arouse fear before the divine judgment.", source: "Chinuch #405" },
    { authority: "Shulchan Aruch", position: "We blow 100 shofar sounds in total — 30 before mussaf, 30 during the silent Shemoneh Esreh, 30 during the cantor's repetition, and 10 after — to cover all possible opinions.", source: "SA OC 592:1-2" },
  ],

  // ── TZITZIT ──────────────────────────────────────────────────────────────

  "Wear tzitzit": [
    { authority: "Rambam", position: "The obligation to wear tzitzit is conditional — one is only obligated if one wears a four-cornered garment. However, it is a great mitzvah to seek out a garment that requires tzitzit. Techelet (blue thread) is required; today we use only white because the source of techelet has been lost.", source: "Hilchot Tzitzit 1:1-4; 3:12" },
    { authority: "Ramban", position: "The obligation to wear tzitzit is absolute — one should always wear such a garment in order to always have tzitzit. It is not merely conditional.", source: "Ramban on Bamidbar 15:39" },
    { authority: "Tosafot", position: "Women are exempt from tzitzit (time-bound positive mitzvah), but if they wear such a garment, they should attach tzitzit without a blessing.", source: "Tosafot, Menachot 43a" },
    { authority: "Radziner Rebbe", position: "Claimed to have rediscovered techelet using the cuttlefish. Many did not accept this identification.", source: "Sifrei Radzin; 19th century" },
    { authority: "Bnei Yisrael / Tekhelet Institute", position: "Modern scholars identify techelet as coming from the Murex trunculus snail. A growing number of authorities accept this identification, and many now wear techelet on their tzitzit.", source: "Contemporary halachic literature, 20th-21st century" },
    { authority: "Sefer HaChinuch", position: "The thread of techelet reminds us of the sky, the sky reminds us of the divine throne, and this reminds us of all the commandments — a complete chain of remembrance.", source: "Chinuch #386" },
  ],

  // ── TZEDAKAH ─────────────────────────────────────────────────────────────

  "Give charity generously": [
    { authority: "Rambam", position: "One is obligated to give tzedakah according to what the poor person needs, not merely according to one's convenience. One should not give less than one-third of a shekel annually. Ideally one should give one-tenth of income; never more than one-fifth (lest one become poor oneself).", source: "Hilchot Matnot Aniyim 7:5; 8:13" },
    { authority: "Ramban", position: "The verse 'open, you shall open your hand' implies an obligation beyond a fixed percentage — one must give until the need is fully met, if able.", source: "Ramban on Devarim 15:8" },
    { authority: "Ra'avad", position: "Disputes Rambam's upper limit of one-fifth — exceptional individuals may give more than a fifth to the poor.", source: "Hassagot on Hilchot Matnot Aniyim" },
    { authority: "Sefer HaChinuch", position: "There are 613 mitzvot, but tzedakah is among the most comprehensive, since it fulfills aspects of love of God, love of neighbor, and sustaining the Jewish people simultaneously.", source: "Chinuch #479" },
    { authority: "Rema", position: "One who gives tzedakah to non-Jews as well as Jews fulfills the mitzvah of 'darchei shalom' (ways of peace). Ideally the Jewish poor take priority.", source: "Rema, SA YD 251:1" },
  ],

  "Lend money to the poor": [
    { authority: "Rambam", position: "Lending to a poor person is a greater mitzvah than giving charity, because it preserves the borrower's dignity — he does not feel like a charity recipient.", source: "Hilchot Matnot Aniyim 10:7" },
    { authority: "Sefer HaChinuch", position: "The obligation to lend applies even when the lender fears he will not be repaid. The verse 'you shall surely lend' is an absolute command regardless of prospects of repayment.", source: "Chinuch #66, #478" },
    { authority: "Tosafot", position: "Disputes whether the mitzvah of lending applies only to poor borrowers or to all who need a loan.", source: "Tosafot, Bava Metzia 70b" },
    { authority: "Shulchan Aruch", position: "It is forbidden to demand repayment when one knows the borrower cannot pay — doing so embarrasses the poor person and violates 'do not oppress him.'", source: "SA CM 97:2" },
  ],

  // ── PARENTS & FAMILY ──────────────────────────────────────────────────────

  "Honor your father and mother": [
    { authority: "Rambam", position: "Honoring parents includes feeding, clothing, and accompanying them. Fearing them includes not sitting in their designated seat, not contradicting them, and not calling them by their first names.", source: "Hilchot Mamrim 6:3" },
    { authority: "Ramban", position: "Even greater obligations of deference are implied — one should stand when a parent enters the room, as one would stand for a Torah scholar or a king.", source: "Ramban on Shemot 20:12" },
    { authority: "Rashi", position: "'Honor' (kavod) involves financial expenditure; 'fear' (yirah) does not require money but requires complete deference in speech and behavior.", source: "Rashi, Kiddushin 31b" },
    { authority: "Tosafot", position: "If a parent commands a child to do something that contradicts a Torah law, the child must not obey — honoring God takes precedence over honoring parents.", source: "Tosafot, Yevamot 6a" },
    { authority: "Sefer HaChinuch", position: "The commandment to honor parents parallels honoring God — parents are partners with God in one's creation. The reward of long life is attached to this mitzvah because it is so fundamental to human civilization.", source: "Chinuch #33" },
  ],

  // ── INTERPERSONAL ─────────────────────────────────────────────────────────

  "Love your neighbor as yourself": [
    { authority: "Rabbi Akiva", position: "This is the great foundational principle of the entire Torah — 'love your neighbor as yourself.'", source: "Sifra, Kedoshim; Yerushalmi Nedarim 9:4" },
    { authority: "Ben Azzai", position: "Disputes Rabbi Akiva, saying 'In the image of God He created him' (Bereishit 5:1) is a greater principle, since it extends even to one's attitude toward enemies and strangers.", source: "Sifra, Kedoshim; Bereishit Rabbah 24:7" },
    { authority: "Rambam", position: "The mitzvah obligates speaking well of others, protecting their money as one would protect one's own, and working for their honor. It applies to all Jews.", source: "Sefer HaMitzvot PM #206; Hilchot Avel 14:1" },
    { authority: "Ramban", position: "Total love 'as yourself' is humanly impossible — the Sages interpreted it as desiring for your neighbor what he desires for himself. The mitzvah sets a direction, not an impossible absolute.", source: "Ramban on Vayikra 19:17" },
    { authority: "Sefer HaChinuch", position: "We are to love every Jew in our heart — not merely perform acts of kindness while harboring ill feeling. Inner attitude is part of the mitzvah.", source: "Chinuch #243" },
  ],

  "Rebuke a sinner": [
    { authority: "Rambam", position: "One is obligated to rebuke a fellow Jew who sins — privately, gently, and repeatedly until the person changes or until the person responds with hostility. One may not embarrass a person in public.", source: "Hilchot De'ot 6:7" },
    { authority: "Ra'avad", position: "Disputes: one is obligated to rebuke only if one believes the rebuke will be accepted. If it will clearly be rejected and cause greater transgression, one should remain silent.", source: "Hassagot on Hilchot De'ot 6:7; cf. Yevamot 65b" },
    { authority: "Rashi", position: "The rebuke must be spoken face to face and in private — public rebuke borders on embarrassing the other person, which the same verse prohibits.", source: "Rashi, Vayikra 19:17" },
    { authority: "Sefer HaChinuch", position: "The obligation falls on every Jew regardless of their own status. One who is sinning is not thereby exempt from rebuking others for their sins.", source: "Chinuch #239" },
  ],

  "Do not hate your fellow Jew in your heart": [
    { authority: "Rambam", position: "The prohibition is specifically against harboring inner hatred while externally appearing friendly — this is hypocrisy and is more severe than open conflict, which can be resolved through rebuke.", source: "Hilchot De'ot 6:5" },
    { authority: "Sefer HaChinuch", position: "Internal hatred is prohibited even if the other person wronged you. The appropriate response is to rebuke the person and then resolve the matter, not to nurse a secret grievance.", source: "Chinuch #238" },
    { authority: "Ramban", position: "This prohibition and the companion prohibition of taking revenge are interrelated — they together protect against the gradual erosion of communal trust and love.", source: "Ramban on Vayikra 19:17-18" },
  ],

  "Do not take revenge": [
    { authority: "Rambam", position: "Revenge is prohibited even in words — saying 'I will not lend you my tool since you refused me' is a form of revenge. One must completely erase any sense of grievance from one's heart.", source: "Hilchot De'ot 7:7-8" },
    { authority: "Sefer HaChinuch", position: "The prohibition against revenge applies only between Jew and Jew; it does not require one to forgive those who seek to destroy Israel.", source: "Chinuch #241" },
    { authority: "Tosafot", position: "Disputes whether revenge in words (without action) truly violates a biblical prohibition or is only a rabbinic enactment.", source: "Tosafot, Yoma 23a" },
  ],

  "Do not bear a grudge": [
    { authority: "Rambam", position: "Bearing a grudge is prohibited even if one chooses to lend or help the person who wronged you — one may not mention the past wrong even while acting benevolently.", source: "Hilchot De'ot 7:8" },
    { authority: "Ramban", position: "The prohibition is more nuanced — one may remember a past wrong in one's mind but must not act on it or verbalize it. Complete memory erasure, while ideal, may not be biblically required.", source: "Ramban on Vayikra 19:18" },
  ],

  "Do not embarrass anyone publicly": [
    { authority: "Rambam", position: "Publicly embarrassing a person is compared to bloodshed — the blood drains from the face and the person 'dies' of shame. One who habitually embarrasses others has no share in the World to Come.", source: "Hilchot De'ot 6:8" },
    { authority: "Tosafot", position: "Some embarrassments are worse than others; deliberately and repeatedly embarrassing someone in public is a biblical prohibition of extreme severity.", source: "Tosafot, Bava Metzia 58b-59a" },
    { authority: "Sefer HaChinuch", position: "One should rather be thrown into a fiery furnace than embarrass another person — as Tamar taught by risking death rather than accusing Judah publicly.", source: "Chinuch #240" },
  ],

  "Do not spread false reports or slander": [
    { authority: "Rambam", position: "Rechilut (tale-bearing) is prohibited even when the information is true. Lashon hara (evil speech) causes social damage far beyond the immediate parties. The prohibition applies even when listening to such speech.", source: "Hilchot De'ot 7:1-2" },
    { authority: "Chafetz Chaim", position: "Expands the prohibition to include: speaking lashon hara even about oneself, writing it, and hinting at it. True speech that damages another's reputation is still biblically prohibited.", source: "Sefer Chafetz Chaim, Introduction (19th-20th century)" },
    { authority: "Sefer HaChinuch", position: "The prohibition extends to three separate sins: lashon hara (speaking ill), rechilut (tale-bearing), and motzi shem ra (false accusation). All three are covered by this mitzvah and adjacent prohibitions.", source: "Chinuch #236" },
  ],

  // ── KOHANIM & TEMPLE ──────────────────────────────────────────────────────

  "The Kohanim shall bless the people (duchening)": [
    { authority: "Rambam", position: "The Priestly Blessing is a biblical obligation incumbent on every Kohen. A Kohen who refuses to bless when called violates a positive commandment.", source: "Hilchot Tefillah 15:12; Sefer HaMitzvot PM #26" },
    { authority: "Ra'avad", position: "Disputes whether the obligation applies when there is no minyan (quorum). Rambam implies it applies even without a minyan; Ra'avad says the blessing requires a congregation.", source: "Hassagot on Hilchot Tefillah 15:12" },
    { authority: "Rema", position: "Ashkenazic custom: Kohanim bless only on Yom Tov (festivals), not on ordinary Shabbatot or weekdays in the Diaspora, because a Kohen who is not in a joyful state should not bless. Sephardim bless every day.", source: "Rema, SA OC 128:44" },
    { authority: "Tosafot", position: "A Kohen who is a Torah scholar but has committed a serious sin may still recite the blessing — we do not assess inner worthiness; the ritual act depends on status, not personal righteousness.", source: "Tosafot, Gittin 59b" },
  ],

  "Build the Holy Temple": [
    { authority: "Rambam", position: "Building the Temple is a positive mitzvah for all generations. The obligation applies as soon as there is a king, the Temple Mount is secure, and the enemies of Israel are subdued.", source: "Hilchot Beit HaBechira 1:1; Sefer HaMitzvot PM #20" },
    { authority: "Ramban", position: "The mitzvah to build the Temple applies in every generation when Israel is in its land. We are obligated to rebuild it even without the Messiah — waiting is not an option.", source: "Ramban, Hassagot on Sefer HaMitzvot PM #17" },
    { authority: "Abarbanel", position: "The rebuilding of the Temple is reserved for the Messianic era and cannot be accomplished by human initiative alone — it will descend from Heaven or be built with supernatural assistance.", source: "Abarbanel on Vayikra" },
    { authority: "Sefer HaChinuch", position: "The Temple is the place designated for Israel's prayer, service, and national gathering. Its construction is the collective responsibility of the entire nation, not only the king or the Kohanim.", source: "Chinuch #95" },
  ],

  "Observe the sabbatical year (sh'mittah)": [
    { authority: "Rambam", position: "The sh'mittah obligations in Israel today are biblical. One must allow the land to lie fallow, ownerless produce must be available to all, and agricultural debts are released.", source: "Hilchot Sh'mittah veYovel 1:1-5" },
    { authority: "Ramban", position: "The sh'mittah obligations are fully biblical even after the exile of the ten tribes, since the Torah does not limit them to when all Jews are in the land.", source: "Ramban on Vayikra 25:2" },
    { authority: "Ra'avad", position: "Today sh'mittah in Israel is rabbinic in nature, not biblical, because the full biblical sh'mittah requires that all twelve tribes reside in their tribal territories.", source: "Hassagot on Hilchot Sh'mittah 4:25" },
    { authority: "Heter Mechirah", position: "Rabbi Yitzchak Elchanan Spektor (19th c.) and later the Chief Rabbinate permitted a temporary sale of land to a non-Jew during sh'mittah to avoid economic collapse. Many poskim oppose this leniency.", source: "Responsa literature, 19th-21st century" },
    { authority: "Chazon Ish", position: "The heter mechirah does not work and is prohibited. Every effort must be made to observe sh'mittah fully, even at great financial cost.", source: "Chazon Ish on Shvi'it" },
  ],

  // ── KOSHER ────────────────────────────────────────────────────────────────

  "Examine the signs of a kosher animal": [
    { authority: "Rambam", position: "Any animal with both split hooves and that chews its cud is kosher. The Torah lists four animals that have only one sign: the camel, hyrax, hare (chew cud), and pig (split hooves). Any other single-sign animal is therefore not a new doubt — all possibilities are covered.", source: "Hilchot Ma'achalot Asurot 1:6-8" },
    { authority: "Ra'avad", position: "Disputes Rambam's claim that all single-sign animals are explicitly identified. New animals not mentioned in the Torah must be examined on their own merits.", source: "Hassagot on Hilchot Ma'achalot Asurot 1:8" },
    { authority: "Sefer HaChinuch", position: "The kosher laws train us in self-control and elevate our spiritual nature. An animal with both signs fully symbolizes the combination of external conduct and internal refinement.", source: "Chinuch #147-150" },
  ],

  "Do not eat blood": [
    { authority: "Rambam", position: "The biblical prohibition against eating blood applies to all blood of mammals and fowl. Fish blood is permitted. The manner of kashering meat (salting and rinsing) was instituted to remove absorbed blood.", source: "Hilchot Ma'achalot Asurot 6:1-4" },
    { authority: "Ra'avad", position: "Disputes the extent to which absorbed blood inside the meat is biblically prohibited vs. only the freely flowing blood.", source: "Hassagot on Hilchot Ma'achalot Asurot 6:5" },
    { authority: "Tosafot", position: "Debates the halachic status of the reddish juice released from meat after cooking — is it 'blood' or merely a meat-colored fluid?", source: "Tosafot, Chullin 113a" },
    { authority: "Shulchan Aruch", position: "One must salt meat for one hour to expel blood, rinse it before and after, and not cook it in its own blood. Liver must be broiled directly over fire, not merely salted.", source: "SA YD 69:1; 73:1" },
  ],

  "Do not eat a limb torn from a living animal (ever min hachai)": [
    { authority: "Rambam", position: "This is one of the Seven Noahide Laws, applying to all humanity. Jews have an additional prohibition from the Torah (Devarim 12:23).", source: "Hilchot Melachim 9:10; Hilchot Ma'achalot Asurot 5:1" },
    { authority: "Ramban", position: "The prohibition for Jews derives from the verse 'you shall not eat the blood' — the blood still in a living animal's limb is included.", source: "Ramban on Devarim 12:23" },
    { authority: "Sefer HaChinuch", position: "The prohibition teaches compassion — one must not eat while the animal still lives. It also guards against cruelty that would desensitize us to suffering.", source: "Chinuch #452" },
  ],

  // ── INTERPERSONAL COMMERCE ────────────────────────────────────────────────

  "Pay the hired laborer on time": [
    { authority: "Rambam", position: "One must pay a day-worker by nightfall and a night-worker by dawn. Withholding wages beyond the deadline violates two separate biblical prohibitions: 'you shall not oppress' and 'the sun shall not set on his wages.'", source: "Hilchot Sechirut 11:1-2" },
    { authority: "Ramban", position: "The obligation applies to any service contract, not just daily laborers — anyone who performs a service for hire must be paid promptly.", source: "Ramban on Vayikra 19:13" },
    { authority: "Shulchan Aruch", position: "The worker must demand payment on the day earned; an employer who was not asked for payment does not violate the prohibition. However, practically one must ensure the worker receives payment promptly.", source: "SA CM 339:10" },
    { authority: "Sefer HaChinuch", position: "The poor worker may have been relying on his wages for that evening's meal. Withholding his wages is effectively robbing him of his livelihood at the most critical moment.", source: "Chinuch #588" },
  ],

  "Return a lost object to its owner": [
    { authority: "Rambam", position: "Returning a lost object is obligatory for all Jews. One who finds an object must care for it as a watchman until it is returned. There is no obligation if the finder is an elder whose dignity would be compromised by carrying the object.", source: "Hilchot Gezelah vaAvedah 11:1-4" },
    { authority: "Sefer HaChinuch", position: "The mitzvah applies even if the lost object is of minimal value. The obligation to return reflects the principle that all Jewish property is communally interconnected.", source: "Chinuch #538" },
    { authority: "Tosafot", position: "Disputes whether one must spend money from one's own pocket to preserve the lost object while waiting to find the owner.", source: "Tosafot, Bava Metzia 28b" },
  ],

  // ── LIFE & DEATH ──────────────────────────────────────────────────────────

  "Do not murder": [
    { authority: "Rambam", position: "Murder includes any deliberate killing of an innocent person. One who kills a person through an agent who willingly kills is not liable to the death penalty — but is guilty of a grievous sin.", source: "Hilchot Rotze'ach 2:2-3" },
    { authority: "Tosafot", position: "Disputes whether causing someone's death indirectly (grama beNezakin) constitutes a biblical violation or only a rabbinic one.", source: "Tosafot, Bava Kama 60a" },
    { authority: "Sefer HaChinuch", position: "The prohibition against murder is foundational to all human civilization. A society that does not protect human life cannot endure, and this is why the Seven Noahide Laws include this prohibition.", source: "Chinuch #34" },
  ],

  "Do not stand idly by your fellow's blood": [
    { authority: "Rambam", position: "One is obligated to save a fellow Jew from danger — from water, fire, or attack. One must hire others to save him if one cannot do so personally, even at financial cost.", source: "Hilchot Rotze'ach 1:14" },
    { authority: "Sefer HaChinuch", position: "This mitzvah includes testifying in court on someone's behalf when one has relevant knowledge — withholding testimony that could save a person is a form of 'standing by their blood.'", source: "Chinuch #237" },
    { authority: "Ramban", position: "The verse creates an absolute obligation to intervene. One may not hide behind helplessness as an excuse when intervention is genuinely possible.", source: "Ramban on Vayikra 19:16" },
  ],

  "Bury the dead": [
    { authority: "Rambam", position: "Burial is obligatory for all Jews. Leaving a corpse unburied is a disgrace and a biblical violation. A High Priest who normally cannot become impure must even become impure to bury a met mitzvah (an unattended corpse).", source: "Hilchot Avel 14:1; Sefer HaMitzvot PM #231" },
    { authority: "Ramban", position: "The obligation to bury applies even to an executed criminal — the body of even the worst sinner must be shown dignity. The earth itself requires this: 'you shall not defile your land.'", source: "Ramban on Devarim 21:23" },
    { authority: "Ra'avad", position: "Disputes whether the obligation to bury is primarily from this verse (Devarim 21:23) or from the verse about the kohen who may not defile himself — implying burial is the assumed norm.", source: "Hassagot" },
  ],

  // ── OATHS & VOWS ─────────────────────────────────────────────────────────

  "Do not take God's name in vain": [
    { authority: "Rambam", position: "A shevuat shav (vain oath) includes: swearing to do something impossible, swearing about something self-evidently true (I swear the sun is hot), or swearing to violate a commandment. All are biblically prohibited.", source: "Hilchot Shvuot 1:1-4" },
    { authority: "Ramban", position: "The core prohibition is treating God's name as a meaningless tool. Even an oath that involves no deliberate falsehood, if sworn carelessly, violates the spirit of this commandment.", source: "Ramban on Shemot 20:7" },
    { authority: "Sefer HaChinuch", position: "Using God's name casually erodes our sense of the divine majesty. Every unnecessary oath diminishes the world's awareness of God's presence.", source: "Chinuch #30" },
  ],

  "Do not swear unnecessarily": [
    { authority: "Rambam", position: "A shevuat shav (frivolous oath) about something that is patently true or false is prohibited and carries the punishment of lashes. An accidental oath carries an obligation of a guilt offering.", source: "Hilchot Shvuot 1:5; 2:1" },
    { authority: "Ra'avad", position: "Disputes the exact categories of prohibited oaths — specifically whether an oath about the future that turns out to be unfulfilled falls under shevuat shav or the separate category of shevuat bituy.", source: "Hassagot on Hilchot Shvuot 1:5" },
  ],

  "Keep your oaths and vows": [
    { authority: "Rambam", position: "One who takes a vow (neder) or an oath (shvuah) is bound by it. Vows may be annulled by a rabbi (hatarat nedarim); oaths of this type may also be annulled under certain conditions.", source: "Hilchot Nedarim 1:1-3; Sefer HaMitzvot PM #94" },
    { authority: "Ramban", position: "It is preferable never to take a vow at all — the Torah says 'if you refrain from vowing, there will be no sin in you.' A person who vows has brought themselves into unnecessary danger of sin.", source: "Ramban on Bamidbar 30:3" },
    { authority: "Sefer HaChinuch", position: "A person is tested by whether they honor their word. One whose word is reliable is trustworthy; one who breaks vows is unreliable in all matters.", source: "Chinuch #406" },
  ],

  // ── CIRCUMCISION ─────────────────────────────────────────────────────────

  "Circumcise all males on the eighth day": [
    { authority: "Rambam", position: "Circumcision on the eighth day is a positive mitzvah incumbent on the father. If the father does not do it, it falls to the beit din. If neither does it, the boy becomes obligated upon adulthood. Circumcision performed on the wrong day (before or after the eighth) is still valid.", source: "Hilchot Milah 1:1-2" },
    { authority: "Ramban", position: "The eighth day is essential and specifically chosen — just as the newborn must first experience a Shabbat (which occurs in the first seven days), so the covenant begins after the world is created anew.", source: "Ramban on Bereishit 17:12" },
    { authority: "Sefer HaChinuch", position: "The eighth day corresponds to the completion of the natural cycle (seven days) plus one — it represents going beyond nature into the realm of the covenant with God.", source: "Chinuch #2" },
    { authority: "Rashi", position: "A sick infant is not circumcised until he fully recovers — two complete days after recovery. Pikuach nefesh overrides the mitzvah of milah entirely.", source: "Rashi, Shabbat 135a" },
  ],

  // ── MEZUZAH / TEFILLIN topics merged above ────────────────────────────────

  "Every person shall write a Torah scroll": [
    { authority: "Rambam", position: "Every Jewish male is obligated to write a Torah scroll, or have one written for him. Today, one who buys or arranges to have Torah books written fulfills the spirit of the mitzvah.", source: "Hilchot Sefer Torah 7:1; Sefer HaMitzvot PM #18" },
    { authority: "Ra'avad", position: "Disputes whether purchasing an existing Torah scroll counts as fulfilling the mitzvah — the mitzvah specifically says 'write,' not 'acquire.'", source: "Hassagot on Hilchot Sefer Torah 7:1" },
    { authority: "Rema", position: "Since most people cannot afford a complete Torah scroll, the custom developed to commission the writing of individual books or portions of the Torah. Writing a single letter also has some significance.", source: "Rema, SA YD 270:2" },
    { authority: "Sefer HaChinuch", position: "The Torah scroll must be in one's home and available for study. The obligation is to possess the Torah — the writing is the means of acquisition.", source: "Chinuch #613" },
  ],

  // ── COUNTING OMER ─────────────────────────────────────────────────────────

  "Count the Omer — 49 days from Passover to Shavuot": [
    { authority: "Rambam", position: "Counting the Omer is a positive biblical mitzvah. Each day's count is a separate mitzvah. Today, without the Temple, the obligation is rabbinic according to most authorities — though Rambam himself seems to treat it as biblical even today.", source: "Hilchot Temidin uMusafin 7:22-24" },
    { authority: "Ramban", position: "Today the Omer count is biblical in status, since the Torah commands counting 'from the morrow after the rest day' without limiting it to the Temple era.", source: "Ramban on Vayikra 23:15" },
    { authority: "Tosafot", position: "If one misses a day, one may not continue counting with a blessing for the remaining days, since each day's count depends on the previous — 'count for yourselves' implies a complete count.", source: "Tosafot, Menachot 66a; this is the dominant Ashkenazic ruling" },
    { authority: "Ra'avad", position: "Even if one misses a day, one may continue counting with a blessing — each day is an independent mitzvah.", source: "Hassagot on Hilchot Temidin 7:24" },
    { authority: "Sefer HaChinuch", position: "The Omer period is a process of spiritual refinement connecting the redemption of Pesach to the receiving of Torah at Shavuot. We count upward, toward a goal — this distinguishes it from counting down.", source: "Chinuch #306" },
  ],

  "Say Sefiras HaOmer each night": [
    { authority: "Shulchan Aruch", position: "The Omer must be counted at night after nightfall. One who counts during the day has fulfilled the mitzvah but should ideally count again at night without a blessing.", source: "SA OC 489:1" },
    { authority: "Rema", position: "One should count standing. If one counted sitting, one has fulfilled the obligation.", source: "Rema, SA OC 489:1" },
    { authority: "Magen Avraham", position: "One who is asked what day of the Omer it is and answers correctly before the formal count is considered to have already 'counted' for that night and must count again without a blessing.", source: "Magen Avraham, OC 489" },
  ],

  // ── TESHUVAH ─────────────────────────────────────────────────────────────

  "Observe all afflictions of Yom Kippur": [
    { authority: "Rambam", position: "Teshuvah (repentance) is a complete biblical mitzvah. True teshuvah has four components: (1) ceasing the sin, (2) remorse, (3) confession before God (vidui), (4) resolving not to repeat the sin.", source: "Hilchot Teshuvah 2:2" },
    { authority: "Ramban", position: "Teshuvah is primarily a matter of the heart — external confession without inner transformation is meaningless. But external acts (fasting, prayer, tzedakah) support and catalyze the inner process.", source: "Ramban, Torat Ha'Adam" },
    { authority: "Ra'avad", position: "Disputes Rambam's position that teshuvah removes the record of sins in the divine ledger — some sins leave permanent spiritual damage that can only be expiated through suffering.", source: "Hassagot on Hilchot Teshuvah 1:3" },
    { authority: "Sefer HaChinuch", position: "Teshuvah is among the greatest kindnesses God extends to humanity — the ability to truly repair a damaged soul. Without it, a person who sins even once would be forever lost.", source: "Chinuch #364" },
  ],

  // ── AGRICULTURE ──────────────────────────────────────────────────────────

  "Bring the first fruits (bikkurim) to the Temple": [
    { authority: "Rambam", position: "Bikkurim apply only to the seven species of the Land of Israel. The owner must bring them to Jerusalem personally, present them to the Kohen, and recite the declaration while holding the basket.", source: "Hilchot Bikkurim 4:1-3" },
    { authority: "Sefer HaChinuch", position: "The mitzvah of bikkurim instills gratitude — one acknowledges that the first and best fruits come from God's blessing, not one's own effort.", source: "Chinuch #91" },
    { authority: "Tosafot", position: "Disputes whether the bikkurim obligation applies even to a Kohen (who cannot read the declaration to himself) or only to Israelites.", source: "Tosafot, Bikkurim 1:1" },
  ],

  // ── NAZIRITE ─────────────────────────────────────────────────────────────

  "Observe all laws of the nazirite vow": [
    { authority: "Rambam", position: "A nazirite is one who voluntarily accepts extra holiness by abstaining from wine, grapes, haircuts, and contact with the dead. The nazirite is called 'holy' by the Torah, since self-imposed restrictions in the service of God are praiseworthy.", source: "Hilchot Nezirut 1:1-2" },
    { authority: "Ramban", position: "The nazirite is described as both holy AND as needing atonement at the end (due to wasting his life in abstinence). This suggests that the nazirite path is valid but not ideal for most people.", source: "Ramban on Bamidbar 6:14" },
    { authority: "Rabbi Elazar HaKapar / Talmud", position: "The nazirite sins against himself by denying himself wine (Nedarim 77b). The more moderate view: vowing unnecessarily is spiritually dangerous.", source: "Nedarim 77b; Sifri on Nasso" },
    { authority: "Sefer HaChinuch", position: "The nazirite laws demonstrate that Judaism does not require asceticism — this level of self-denial is acceptable only when done as a vow, not as a permanent life choice.", source: "Chinuch #374-376" },
  ],

  // ── RED HEIFER ────────────────────────────────────────────────────────────

  "Observe the red heifer (parah adumah) purification process": [
    { authority: "Rambam", position: "The parah adumah is the classic chok — a divine decree beyond human understanding. Its paradoxical nature (it purifies the impure but renders the pure impure) is intentional; it teaches that mitzvot are binding even when their rationale escapes us.", source: "Hilchot Parah Adumah 3:1; Moreh Nevuchim 3:47" },
    { authority: "Ramban", position: "The parah adumah does have a reason — it is an atonement related to the golden calf (the mother cow atoning for the calf). The 'mystery' is not the reason but the mechanism.", source: "Ramban on Bamidbar 19:2" },
    { authority: "Rashi", position: "We should not question God's decrees, just as one should not question a king who ordered unusual behavior. The chok is a test of pure obedience.", source: "Rashi on Bamidbar 19:2" },
    { authority: "Sefer HaChinuch", position: "Every detail of the parah adumah reflects deep significance — the redness (sin), the absence of a yoke (liberation), the cedar and hyssop (pride humbled). We cannot access all the meaning, but all meaning is there.", source: "Chinuch #397" },
  ],

  // ── CITIES OF REFUGE ─────────────────────────────────────────────────────

  "Establish six cities of refuge": [
    { authority: "Rambam", position: "Three cities of refuge were in Transjordan and three in Canaan. In the Messianic era, three more will be added in the expanded territory of Israel. The roads to them must be clearly marked and well-maintained.", source: "Hilchot Rotze'ach 8:1-5" },
    { authority: "Ramban", position: "The cities of refuge reflect divine mercy — even one who kills unintentionally disrupts the divine order, but the Torah provides protection rather than abandoning the accidental killer.", source: "Ramban on Bamidbar 35:11" },
    { authority: "Sefer HaChinuch", position: "The institution of cities of refuge demonstrates that intent determines culpability. Unintentional harm requires protection, not punishment — justice must be measured.", source: "Chinuch #410" },
  ],

  // ── MARRIAGE & FAMILY ─────────────────────────────────────────────────────

  "Marry in accordance with Jewish law (kiddushin and chuppah)": [
    { authority: "Rambam", position: "A man may not live with a woman without kiddushin (legal betrothal). One who does so violates a rabbinic enactment against concubinage; some say it is also a biblical violation.", source: "Hilchot Ishut 1:1-4" },
    { authority: "Ramban", position: "The prohibition against living with a woman without marriage is a biblical prohibition derived from 'there shall be no harlotry' — an unmarried relationship is classified as zonah.", source: "Ramban on Devarim 23:18" },
    { authority: "Ra'avad", position: "A dedicated concubine (pilegesh) without full kiddushin was permitted to kings and leaders in ancient times. Today it is prohibited rabbinically.", source: "Hassagot on Hilchot Ishut 1:4" },
    { authority: "Sefer HaChinuch", position: "Jewish marriage establishes sanctity in human relationships. The Hebrew word 'kiddushin' means 'sanctification' — the couple becomes 'set apart' for each other.", source: "Chinuch #552" },
  ],

  // ── PRAYER & RITUAL ──────────────────────────────────────────────────────

  "Recite Birkat Hamazon after eating bread": [
    { authority: "Rambam", position: "Birkat Hamazon after eating bread is a biblical obligation derived from 'you shall eat and be satisfied and bless the Lord your God.' Three blessings are biblical; the fourth (HaTov veHaMeitiv) is rabbinic.", source: "Hilchot Berakhot 1:1; 2:1" },
    { authority: "Tosafot", position: "Disputes whether the biblical obligation requires eating a full 'satiation' — a kazayit (olive's worth) may suffice to trigger at least a rabbinic obligation to say Birkat Hamazon.", source: "Tosafot, Berakhot 20b" },
    { authority: "Ra'avad", position: "Women are obligated in Birkat Hamazon from the Torah — it is not time-bound and therefore applies equally to men and women.", source: "Hassagot on Hilchot Berakhot" },
    { authority: "Shulchan Aruch", position: "One must wash hands (mayim acharonim) before Birkat Hamazon. One must sit while reciting it — walking while benching is permitted only be-di'avad.", source: "SA OC 181:1; 183:9" },
  ],

  // ── KOSHER & PURITY LAWS ─────────────────────────────────────────────────

  "Do not eat the sinew of the thigh vein (gid hanasheh)": [
    { authority: "Rambam", position: "The prohibition against gid hanasheh applies to all kosher animals — domestic and wild. It applies to the right thigh and left thigh. Both the sciatic nerve itself and the surrounding fat are included in the prohibition.", source: "Hilchot Ma'achalot Asurot 8:1-5" },
    { authority: "Ra'avad", position: "Disputes whether the prohibition applies equally to both right and left sides — the verse implies the specific spot where the angel struck Jacob, which was one side.", source: "Hassagot on Hilchot Ma'achalot Asurot 8:2" },
    { authority: "Tosafot", position: "Debates whether the prohibition originated with Jacob's sons at the time of the event, or was retroactively given at Sinai. The practical difference involves its status among the 613 mitzvot.", source: "Tosafot, Chullin 100a" },
    { authority: "Sefer HaChinuch", position: "The prohibition commemorates Jacob's struggle with the angel — it reminds us that our physical limitations (represented by the thigh wound) do not diminish our spiritual capacity for wrestling with the divine.", source: "Chinuch #3" },
  ],

  // ── PASSOVER ADDITIONAL ──────────────────────────────────────────────────

  "Sanctify the new month (Rosh Chodesh)": [
    { authority: "Rambam", position: "In Temple times, the new month was declared by the court based on testimony of witnesses who saw the new moon. After the calendar was fixed by Hillel II (4th century), we follow the calculated calendar.", source: "Hilchot Kiddush HaChodesh 1:1-8; 5:1-3" },
    { authority: "Ramban", position: "Even the calculated calendar retains the spirit of the mitzvah, since it was authorized by the rabbinic court. There is no obligation to revert to witness-based declaration until the Sanhedrin is restored.", source: "Ramban on Shemot 12:2" },
    { authority: "Sefer HaChinuch", position: "The sanctification of the month is given specifically to Israel — it teaches that time itself is under our stewardship. We do not merely observe time; we sanctify it.", source: "Chinuch #4" },
  ],

  // ── TZARAAT ──────────────────────────────────────────────────────────────

  "Observe the laws of tzaraat (leprosy)": [
    { authority: "Rambam", position: "Tzaraat is not a medical skin disease but a miraculous punishment for the sin of lashon hara (evil speech). This explains why only Jews are subject to it — non-Jews do not carry this covenantal accountability.", source: "Hilchot Tumat Tzara'at 16:10" },
    { authority: "Ramban", position: "Agrees that tzaraat is supernatural, but also sees it as affecting garments and houses — which have no moral capacity. The broader phenomenon relates to spiritual impurity in the home of Israel.", source: "Ramban on Vayikra 13:47" },
    { authority: "Rashi", position: "The Talmud (Arachin 16a) lists seven sins that cause tzaraat, with lashon hara being primary. The metzora is isolated to contemplate the harm his speech caused.", source: "Rashi on Vayikra 13:2; Arachin 16a" },
    { authority: "Sefer HaChinuch", position: "Today there is no tzaraat in the halachic sense — even if someone develops a similar skin condition, without a Kohen to examine and declare it, the laws do not apply.", source: "Chinuch #169" },
  ],

  // ── ARACHIM / VOWS TO TEMPLE ─────────────────────────────────────────────

  "Observe the laws of vows (nedarim)": [
    { authority: "Rambam", position: "A vow (neder) creates an obligation like a Torah commandment — one who vows and does not fulfill it violates a biblical prohibition. A Rabbi may annul a vow under specific conditions.", source: "Hilchot Nedarim 1:1-4; Sefer HaMitzvot PM #94" },
    { authority: "Ramban", position: "One should avoid making vows entirely. The Talmud says 'one who vows is as if he built a high place (bamah)' — even permitted vows introduce unnecessary risk.", source: "Ramban on Bamidbar 30:3; Nedarim 77b" },
    { authority: "Sefer HaChinuch", position: "The power of the spoken word is immense — the Jewish people elevated themselves through speech (na'aseh v'nishma). A vow made and not kept degrades this sacred capacity.", source: "Chinuch #406" },
  ],

  // ── PURITY ────────────────────────────────────────────────────────────────

  "The woman shall immerse in the mikveh after impurity": [
    { authority: "Rambam", position: "Immersion in the mikveh is biblically required after menstrual or other impurity. The separation during the wife's niddah period is a biblical prohibition of the highest severity (karet).", source: "Hilchot Issurei Biah 4:1-4" },
    { authority: "Ramban", position: "The laws of niddah are among the most profound mysteries of the Torah — they infuse the marital relationship with cycles of separation and reunion that sustain long-term love and sanctity.", source: "Ramban on Vayikra 18:19" },
    { authority: "Ra'avad", position: "Disputes the precise night count and the role of 'clean days' in extending the separation beyond the biblical minimum — a dispute that underlies the difference between biblical and rabbinic niddah requirements.", source: "Hassagot on Hilchot Issurei Biah 6:1" },
    { authority: "Shulchan Aruch", position: "The minimum mikveh is 40 se'ah of water, gathered naturally (rainwater, spring, etc.). The entire body must be submerged simultaneously. Hair must not form a barrier (chatzitzah).", source: "SA YD 199:1-2; 198:1" },
  ],

};
