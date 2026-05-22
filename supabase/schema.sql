-- ============================================================
-- SilencioOrgs — Supabase Schema
-- Paste this into the Supabase SQL Editor and run it once.
-- ============================================================

-- ----- TABLE: prompts -----
create table prompts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null,
  tag           text,
  tag_tone      text,
  tag_icon      text,
  author        text default '@silencioorgs',
  time_label    text,
  visual_subtitle text,
  visual_class  text,
  order_index   int,
  created_at    timestamptz default now()
);

-- ----- TABLE: prompt_modes -----
create table prompt_modes (
  id            uuid primary key default gen_random_uuid(),
  prompt_id     uuid references prompts(id) on delete cascade,
  kind          text not null,
  mode          text not null,
  content       text not null
);

-- ----- INDEXES -----
create index idx_prompts_category    on prompts(category);
create index idx_prompts_order_index on prompts(order_index);
create index idx_prompt_modes_prompt on prompt_modes(prompt_id);
create index idx_prompt_modes_kind   on prompt_modes(kind, mode);

-- ----- ROW LEVEL SECURITY -----
alter table prompts enable row level security;
alter table prompt_modes enable row level security;

-- Public SELECT (anyone can read)
create policy "Public read prompts"
  on prompts for select
  to anon, authenticated
  using (true);

create policy "Public read prompt_modes"
  on prompt_modes for select
  to anon, authenticated
  using (true);

-- Service-role full access (INSERT / UPDATE / DELETE)
create policy "Service role manage prompts"
  on prompts for all
  to service_role
  using (true)
  with check (true);

create policy "Service role manage prompt_modes"
  on prompt_modes for all
  to service_role
  using (true)
  with check (true);

-- ============================================================
-- SEED DATA
-- ============================================================

with inserted_prompts as (
  insert into prompts (title, category, tag, tag_tone, tag_icon, author, time_label, visual_subtitle, visual_class, order_index)
  values
    ('Fashion Drop', 'Fashion', 'Trending', 'green',  'trending_up',          '@silencioorgs', '2h ago',  'Soft daylight outfit demo',      'bg-[#e4f6ea]', 1),
    ('Beauty Pick',  'Beauty',  'Hot',      'yellow', 'local_fire_department', '@silencioorgs', '5h ago',  'Ring light skincare close-up',   'bg-[#eef1fb]', 2),
    ('Home Find',    'Home',    'New',      'green',  'fiber_new',            '@silencioorgs', '8h ago',  'Clean home product setup',       'bg-[#f1f3ff]', 3),
    ('Tech Desk',    'Tech',    'Trending', 'green',  'trending_up',          '@silencioorgs', '11h ago', 'Minimal creator workstation',    'bg-[#e9edff]', 4),
    ('Fitness Kit',  'Fitness', 'Fresh',    'green',  'bolt',                 '@silencioorgs', '1d ago',  'Bright home workout setup',      'bg-[#e7f7ec]', 5)
  returning id, title
),

fashion  as (select id from inserted_prompts where title = 'Fashion Drop'),
beauty   as (select id from inserted_prompts where title = 'Beauty Pick'),
home     as (select id from inserted_prompts where title = 'Home Find'),
tech     as (select id from inserted_prompts where title = 'Tech Desk'),
fitness  as (select id from inserted_prompts where title = 'Fitness Kit')

insert into prompt_modes (prompt_id, kind, mode, content) values
  -- ===== Fashion Drop =====
  ((select id from fashion), 'image', 'background',
    'Change the background to a cozy bedroom with warm natural daylight, aesthetic wall decor, clean creator-style framing, TikTok-ready lifestyle mood, ultra-realistic, 4K.'),
  ((select id from fashion), 'image', 'product',
    'Change the product to a white oversized raglan shirt with brown sleeves, clearly visible fabric texture, flattering fit, affiliate product focus, ultra-realistic TikTok product image.'),
  ((select id from fashion), 'image', 'persona',
    'Change the persona to a stylish young creator with relaxed confidence, candid pose, soft expression, modern TikTok fashion energy, natural daylight, ultra-realistic.'),
  ((select id from fashion), 'video', 'background',
    'Change the video background to a cozy bedroom scene. Start with warm daylight on the wall decor, pan to the creator, then keep the room softly visible through the outfit reveal.'),
  ((select id from fashion), 'video', 'product',
    'Change the video product focus to the white oversized raglan shirt. Open on fabric texture, cut to sleeve detail, show the full fit, then end with a clear affiliate CTA.'),
  ((select id from fashion), 'video', 'persona',
    'Change the video persona to a stylish young creator. Use relaxed mirror-check energy, confident natural movement, quick outfit poses, and a friendly direct-to-camera CTA.'),

  -- ===== Beauty Pick =====
  ((select id from beauty), 'image', 'background',
    'Change the background to a minimalist white beauty counter with soft ring light glow, luxury skincare atmosphere, clean TikTok unboxing composition, photorealistic, ultra-HD.'),
  ((select id from beauty), 'image', 'product',
    'Change the product to a glowy serum bottle with dropper, premium glass packaging, dewy liquid texture, label facing camera, luxury skincare affiliate focus, photorealistic.'),
  ((select id from beauty), 'image', 'persona',
    'Change the persona to a beauty creator with dewy skin applying serum gently, confident calm expression, close-up framing, soft flattering light, TikTok beauty review style.'),
  ((select id from beauty), 'video', 'background',
    'Change the video background to a minimalist beauty counter with soft ring light. Begin with the clean setup, keep the white space premium, and use gentle close-up transitions.'),
  ((select id from beauty), 'video', 'product',
    'Change the video product focus to the glowy serum bottle. Start with the dropper texture, show one cheek application, reveal the finish, then close with a benefit-led CTA.'),
  ((select id from beauty), 'video', 'persona',
    'Change the video persona to a beauty creator with calm confident delivery. Use close-up application, natural facial reactions, and a soft spoken product recommendation.'),

  -- ===== Home Find =====
  ((select id from home), 'image', 'background',
    'Change the background to a bright modern kitchen with a clean counter, soft morning light, neutral home decor, satisfying organized lifestyle mood, realistic TikTok review style.'),
  ((select id from home), 'image', 'product',
    'Change the product to a compact kitchen organizer with visible compartments, tidy storage details, clean edges, practical affiliate product focus, realistic product review style.'),
  ((select id from home), 'image', 'persona',
    'Change the persona to a home creator demonstrating an organized counter setup, approachable expression, hands interacting with the product, bright realistic TikTok style.'),
  ((select id from home), 'video', 'background',
    'Change the video background to a bright modern kitchen. Start on the messy counter, snap to the clean organized surface, and keep the neutral home setting visible.'),
  ((select id from home), 'video', 'product',
    'Change the video product focus to the compact kitchen organizer. Demonstrate three compartments, show before-and-after storage, then close with a practical value CTA.'),
  ((select id from home), 'video', 'persona',
    'Change the video persona to an approachable home creator. Use hands-on demo shots, quick organizing gestures, and a friendly voiceover explaining why the product helps.'),

  -- ===== Tech Desk =====
  ((select id from tech), 'image', 'background',
    'Change the background to a minimalist workstation with laptop, soft daylight, crisp desk shadows, clean cable-free setup, premium creator-shot tech review composition.'),
  ((select id from tech), 'image', 'product',
    'Change the product to a sleek desk gadget centered in frame, premium matte finish, clear functional details, sharp product lighting, photorealistic affiliate tech review style.'),
  ((select id from tech), 'image', 'persona',
    'Change the persona to a tech creator at a clean workstation, focused but approachable expression, hands setting up the gadget, premium short-form review aesthetic.'),
  ((select id from tech), 'video', 'background',
    'Change the video background to a minimalist workstation. Start with a clean desk establishing shot, keep laptop and daylight in frame, and use crisp tech-review cuts.'),
  ((select id from tech), 'video', 'product',
    'Change the video product focus to the sleek desk gadget. Introduce it in one clean motion, show the setup result, highlight one key feature, and end with the pinned-link CTA.'),
  ((select id from tech), 'video', 'persona',
    'Change the video persona to a focused tech creator. Use calm expert delivery, hands setting up the gadget, a quick reaction shot, and a concise recommendation.'),

  -- ===== Fitness Kit =====
  ((select id from fitness), 'image', 'background',
    'Change the background to a bright home workout studio corner with clean floor space, water bottle and towel nearby, energetic wellness mood, realistic short-form ad look.'),
  ((select id from fitness), 'image', 'product',
    'Change the product to portable resistance bands arranged neatly, clear colors and handles, compact storage visible, clean affiliate product placement, realistic fitness ad style.'),
  ((select id from fitness), 'image', 'persona',
    'Change the persona to a fitness creator preparing for a quick home workout, upbeat expression, athletic casual outfit, natural movement, realistic TikTok wellness style.'),
  ((select id from fitness), 'video', 'background',
    'Change the video background to a bright home workout corner. Open with the clean studio setup, keep towel and water bottle visible, and use energetic short-form pacing.'),
  ((select id from fitness), 'video', 'product',
    'Change the video product focus to portable resistance bands. Show the kit unpacked in one second, demonstrate two simple moves, show compact storage, and end with an upbeat CTA.'),
  ((select id from fitness), 'video', 'persona',
    'Change the video persona to an upbeat fitness creator. Use confident warm-up energy, natural movement, quick exercise demos, and a motivating affiliate CTA.');
