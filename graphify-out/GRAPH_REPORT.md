# Graph Report - BoccaCafe-Inventory  (2026-06-02)

## Corpus Check
- 30 files · ~1,437,253 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 310 nodes · 381 edges · 32 communities (20 shown, 12 thin omitted)
- Extraction: 92% EXTRACTED · 7% INFERRED · 1% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `798dba73`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `Exploded Gourmet Burger (Vertical Stack)` - 14 edges
3. `Pizza Quarter Slice` - 10 edges
4. `scripts` - 9 edges
5. `cn()` - 7 edges
6. `LoginPage` - 7 edges
7. `burger-right.png decorative food photograph` - 7 edges
8. `tailwind` - 6 edges
9. `aliases` - 6 edges
10. `LoginCard` - 6 edges

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

## Communities (32 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (32): dependencies, class-variance-authority, clsx, lucide-react, next, radix-ui, react, react-dom (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (16): burger-right.png decorative food photograph, Crispy bacon or chopped tomato bits between patties, Two seared beef patties, Solid black background, Golden bottom bun, Warm food palette (gold bun, red tomato, green lettuce, orange cheese), Double cheeseburger stack, Studio food photography lighting (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.30
Nodes (15): Flame-Grilled Beef Patty, Bottom Bun (Toasted), Cheddar Cheese Slice, Exploded Gourmet Burger (Vertical Stack), Curly Leaf Lettuce (Lower Layer), Curly Leaf Lettuce (Upper Layer), Crinkle-Cut Pickle Slices, Exploded Product Photography on Black Background (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (15): BoccaCafe-Inventory project, Login-focused site metadata, RootLayout, LoginField, loginFields, foodItems floating hero images, rememberField, LoginCard (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (12): Buffalo-Style Chicken Chunks, Fresh Cilantro Garnish, Golden-Brown Pizza Crust, Pizza Quarter Image Asset, Jalapeño Pepper Slice, Melted Mozzarella Cheese, Pizza Quarter Slice, Sliced Red Onion (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (8): LoginCard(), foodItems, LoginPage(), buildLoginPayload(), LoginField, loginFields, LoginPayload, rememberField

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (9): App Icon (icon.svg), Rounded Square Background (#303136), BO Monogram Text, Bocca Cafe Brand Abbreviation (BO), 64×64 Viewport, 18px Corner Radius, Impact / Arial Narrow Typography, Next.js App Router Metadata Icon (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (29): buildPipeStyle(), CustomProperties, PipeStyle, viewportKeys, CustomProperties, MapButton(), MapButtonProps, NodeStyle (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (7): inter, metadata, RootLayout(), cn(), Sidebar(), Button(), buttonVariants

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): Separated frontend/backend architecture, Default Next.js configuration, boccacafe-inventory-frontend npm package

### Community 11 - "Community 11"
Cohesion: 1.00
Nodes (3): buildLoginPayload, LoginPayload, LoginCard handleSubmit

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.40
Nodes (3): Development Status, Project Overview, Repository Structure

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): Answer, Q: What is the exact relationship between LoginPage and Playwright accessibility tree of login page?, Source Nodes

### Community 31 - "Community 31"
Cohesion: 0.05
Nodes (43): ActionHint, actionHints, ActivityItem, activityItems, categoryPoints, ChartPoint, dashboardItem, DateRangeId (+35 more)

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
- **131 isolated node(s):** `PreToolUse`, `$schema`, `plugin`, `@opencode-ai/plugin`, `$schema` (+126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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
- **Why does `cn()` connect `Community 9` to `Community 31`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `$schema`, `plugin` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._