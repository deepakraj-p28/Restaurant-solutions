# Graph Report - .  (2026-05-26)

## Corpus Check
- Corpus is ~42,348 words - fits in a single context window. You may not need a graph.

## Summary
- 148 nodes · 162 edges · 21 communities (13 shown, 8 thin omitted)
- Extraction: 81% EXTRACTED · 16% INFERRED · 3% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Burger-Right Login Asset|Burger-Right Login Asset]]
- [[_COMMUNITY_Exploded Burger Stack|Exploded Burger Stack]]
- [[_COMMUNITY_Login UX & Docs|Login UX & Docs]]
- [[_COMMUNITY_Pizza Quarter Asset|Pizza Quarter Asset]]
- [[_COMMUNITY_Login Page Code|Login Page Code]]
- [[_COMMUNITY_App Icon Branding|App Icon Branding]]
- [[_COMMUNITY_NPM Scripts|NPM Scripts]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Project Architecture|Project Architecture]]
- [[_COMMUNITY_Login Payload Types|Login Payload Types]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PostCSS Pipeline|PostCSS Pipeline]]
- [[_COMMUNITY_Tailwind Design Tokens|Tailwind Design Tokens]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_ESLint Next Rules|ESLint Next Rules]]
- [[_COMMUNITY_TS Config References|TS Config References]]
- [[_COMMUNITY_Path Alias|Path Alias]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `Exploded Gourmet Burger (Vertical Stack)` - 14 edges
3. `Pizza Quarter Slice` - 10 edges
4. `scripts` - 8 edges
5. `LoginPage` - 7 edges
6. `burger-right.png decorative food photograph` - 7 edges
7. `LoginCard` - 6 edges
8. `Login page floating food decoration` - 5 edges
9. `Tomato Slice (Upper)` - 5 edges
10. `Tomato Slice (Middle)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Playwright accessibility tree of login page` --semantically_similar_to--> `LoginPage`  [AMBIGUOUS] [semantically similar]
  .playwright-mcp/page-2026-05-24T12-52-47-424Z.yml → Frontend/app/login/page.tsx
- `BoccaCafe-Inventory project` --conceptually_related_to--> `LoginPage`  [AMBIGUOUS]
  CLAUDE.md → Frontend/app/login/page.tsx
- `LoginCard` --conceptually_related_to--> `Playwright accessibility tree of login page`  [AMBIGUOUS]
  Frontend/components/login/LoginCard.tsx → .playwright-mcp/page-2026-05-24T12-52-47-424Z.yml
- `Separated frontend/backend architecture` --conceptually_related_to--> `boccacafe-inventory-frontend npm package`  [INFERRED]
  CLAUDE.md → Frontend/package.json
- `Smart inventory solutions for Bocca Cafe` --semantically_similar_to--> `BoccaCafe-Inventory project`  [INFERRED] [semantically similar]
  Readme.md → CLAUDE.md

## Hyperedges (group relationships)
- **Login route and form submission flow** — page_home_page, page_login_page, logincard_login_card, login_build_login_payload [EXTRACTED 1.00]
- **Bocca-branded login page experience** — tailwind_bocca_design_tokens, page_login_page, login_page_food_decorations, logincard_login_card [INFERRED 0.85]
- **Next.js frontend build toolchain** — packagejson_boccacafe_inventory_frontend, postcss_tailwind_autoprefixer, tailwind_bocca_design_tokens, tsconfig_path_alias_at [INFERRED 0.75]
- **App Icon Visual Composition** — icon_svg_canvas_64, icon_svg_background, icon_svg_bo_monogram [EXTRACTED 1.00]
- **Double cheeseburger vertical ingredient stack** — burger_right_top_bun_sesame, burger_right_tomato_slice, burger_right_lettuce_layers, burger_right_melted_cheese, burger_right_beef_patties, burger_right_bacon_or_tomato_bits, burger_right_bottom_bun [EXTRACTED 1.00]
- **Login page asymmetric food-float framing (burger-right role)** — burger_right_asset, burger_right_login_decorative_role, burger_right_right_edge_placement, burger_right_left_crop [INFERRED 0.75]
- **Exploded Burger Assembly (Bottom to Top)** — burger_stack_bottom_bun, burger_stack_sauces, burger_stack_tomato_bottom, burger_stack_lettuce_bottom, burger_stack_red_onion_bottom, burger_stack_pickles, burger_stack_tomato_middle, burger_stack_beef_patty, burger_stack_cheddar_cheese, burger_stack_tomato_top, burger_stack_red_onion_top, burger_stack_lettuce_top, burger_stack_top_bun [EXTRACTED 1.00]
- **Identifiable Cafe Burger Inventory Ingredients** — burger_stack_top_bun, burger_stack_bottom_bun, burger_stack_lettuce_top, burger_stack_lettuce_bottom, burger_stack_red_onion_top, burger_stack_red_onion_bottom, burger_stack_tomato_top, burger_stack_tomato_middle, burger_stack_tomato_bottom, burger_stack_cheddar_cheese, burger_stack_beef_patty, burger_stack_pickles, burger_stack_sauces [INFERRED 0.75]
- **Buffalo Chicken Pizza Toppings** — pizza-quarter_melted_cheese, pizza-quarter_buffalo_chicken, pizza-quarter_red_onion, pizza-quarter_jalapeno, pizza-quarter_cilantro, pizza-quarter_red_pepper_flakes [EXTRACTED 1.00]

## Communities (21 total, 8 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 1 - "NPM Dependencies"
Cohesion: 0.11
Nodes (17): dependencies, next, react, react-dom, devDependencies, autoprefixer, eslint, eslint-config-next (+9 more)

### Community 2 - "Burger-Right Login Asset"
Cohesion: 0.19
Nodes (16): burger-right.png decorative food photograph, Crispy bacon or chopped tomato bits between patties, Two seared beef patties, Solid black background, Golden bottom bun, Warm food palette (gold bun, red tomato, green lettuce, orange cheese), Double cheeseburger stack, Studio food photography lighting (+8 more)

### Community 3 - "Exploded Burger Stack"
Cohesion: 0.30
Nodes (15): Flame-Grilled Beef Patty, Bottom Bun (Toasted), Cheddar Cheese Slice, Exploded Gourmet Burger (Vertical Stack), Curly Leaf Lettuce (Lower Layer), Curly Leaf Lettuce (Upper Layer), Crinkle-Cut Pickle Slices, Exploded Product Photography on Black Background (+7 more)

### Community 4 - "Login UX & Docs"
Cohesion: 0.15
Nodes (15): BoccaCafe-Inventory project, Login-focused site metadata, RootLayout, LoginField, loginFields, foodItems floating hero images, rememberField, LoginCard (+7 more)

### Community 5 - "Pizza Quarter Asset"
Cohesion: 0.20
Nodes (12): Buffalo-Style Chicken Chunks, Fresh Cilantro Garnish, Golden-Brown Pizza Crust, Pizza Quarter Image Asset, Jalapeño Pepper Slice, Melted Mozzarella Cheese, Pizza Quarter Slice, Sliced Red Onion (+4 more)

### Community 6 - "Login Page Code"
Cohesion: 0.24
Nodes (6): foodItems, buildLoginPayload(), LoginField, loginFields, LoginPayload, rememberField

### Community 7 - "App Icon Branding"
Cohesion: 0.25
Nodes (9): App Icon (icon.svg), Rounded Square Background (#303136), BO Monogram Text, Bocca Cafe Brand Abbreviation (BO), 64×64 Viewport, 18px Corner Radius, Impact / Arial Narrow Typography, Next.js App Router Metadata Icon (+1 more)

### Community 8 - "NPM Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, dev:fresh, lint, predev, start

### Community 10 - "Project Architecture"
Cohesion: 0.67
Nodes (3): Separated frontend/backend architecture, Default Next.js configuration, boccacafe-inventory-frontend npm package

### Community 11 - "Login Payload Types"
Cohesion: 1.00
Nodes (3): buildLoginPayload, LoginPayload, LoginCard handleSubmit

## Ambiguous Edges - Review These
- `LoginPage` → `BoccaCafe-Inventory project`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to
- `LoginPage` → `Playwright accessibility tree of login page`  [AMBIGUOUS]
  .playwright-mcp/page-2026-05-24T12-52-47-424Z.yml · relation: semantically_similar_to
- `LoginCard` → `Playwright accessibility tree of login page`  [AMBIGUOUS]
  Frontend/components/login/LoginCard.tsx · relation: conceptually_related_to
- `BO Monogram Text` → `Bocca Cafe Brand Abbreviation (BO)`  [AMBIGUOUS]
  Frontend/app/icon.svg · relation: conceptually_related_to
- `Two seared beef patties` → `Crispy bacon or chopped tomato bits between patties`  [AMBIGUOUS]
  Frontend/public/assets/burger-right.png · relation: conceptually_related_to

## Knowledge Gaps
- **72 isolated node(s):** `extends`, `nextConfig`, `name`, `version`, `private` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `LoginPage` and `BoccaCafe-Inventory project`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `LoginPage` and `Playwright accessibility tree of login page`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `LoginCard` and `Playwright accessibility tree of login page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `BO Monogram Text` and `Bocca Cafe Brand Abbreviation (BO)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Two seared beef patties` and `Crispy bacon or chopped tomato bits between patties`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `scripts` connect `NPM Scripts` to `NPM Dependencies`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `extends`, `nextConfig`, `name` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._