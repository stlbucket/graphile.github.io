webpackJsonp([0xdf96aa720cf6],{423:function(n,e){n.exports={data:{remark:{html:'<h2 id="performance"><a href="#performance" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Performance</h2>\n<p>On a Digital Ocean compute-optimised droplet with 8GB of RAM, running\nPostGraphile, PostgreSQL <em>and</em> the benchmarking software all through Docker,\nPostGraphile running in cluster mode over 4 vCPUs can handle 3250 requests per\nsecond for the following simple query:</p>\n<div class="gatsby-highlight">\n      <pre class="language-graphql"><code class="language-graphql"><span class="token keyword">query</span> tracks_media_first_20 <span class="token punctuation">{</span>\n  allTracksList<span class="token punctuation">(</span><span class="token attr-name">first</span><span class="token punctuation">:</span> <span class="token number">20</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    trackId\n    name\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>For a more complex 3-level query, it can handle about 1450 requests per second:</p>\n<div class="gatsby-highlight">\n      <pre class="language-graphql"><code class="language-graphql"><span class="token keyword">query</span> albums_tracks_genre_some <span class="token punctuation">{</span>\n  allAlbumsList<span class="token punctuation">(</span><span class="token attr-name">condition</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token attr-name">artistId</span><span class="token punctuation">:</span> <span class="token number">127</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    artistId\n    title\n    tracksByAlbumIdList <span class="token punctuation">{</span>\n      trackId\n      name\n      genreByGenreId <span class="token punctuation">{</span>\n        name\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>And for a very heavy query such as the following one, it can still serve 550\nrequests per second from a single server, all while maintaining sub-50ms 95th\npercentile latency:</p>\n<div class="gatsby-highlight">\n      <pre class="language-graphql"><code class="language-graphql"><span class="token keyword">query</span> prisma_deeplyNested <span class="token punctuation">{</span>\n  allAlbumsList<span class="token punctuation">(</span><span class="token attr-name">condition</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token attr-name">artistId</span><span class="token punctuation">:</span> <span class="token number">127</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    albumId\n    title\n    tracksByAlbumIdList <span class="token punctuation">{</span>\n      trackId\n      name\n      genreByGenreId <span class="token punctuation">{</span>\n        name\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    artistByArtistId <span class="token punctuation">{</span>\n      albumsByArtistIdList <span class="token punctuation">{</span>\n        tracksByAlbumIdList <span class="token punctuation">{</span>\n          mediaTypeByMediaTypeId <span class="token punctuation">{</span>\n            name\n          <span class="token punctuation">}</span>\n          genreByGenreId <span class="token punctuation">{</span>\n            name\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>To read about how PostGraphile\'s performance compares to that of Prisma, and\nhow to validate the results for yourself, check out <a href="https://medium.com/@Benjie/how-i-made-postgraphile-faster-than-prisma-graphql-server-in-8-hours-e66b4c511160">this\npost</a>\non Medium.</p>\n<h3 id="how-is-it-so-fast"><a href="#how-is-it-so-fast" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>How is it so fast?</h3>\n<p>We leverage graphile-build\'s <a href="/graphile-build/look-ahead/">look-ahead</a> features\nwhen resolving a GraphQL request so that a single root level query, no matter\nhow nested, is compiled into just one SQL query. PostgreSQL has an excellent\nquery planner which optimises and executes this query for us, avoiding the need\nfor multiple round-trips to the database and thus solving the N+1 problem\nthat is found in many GraphQL APIs.</p>\n<p>For example the following query would be compiled into one SQL statement:</p>\n<div class="gatsby-highlight">\n      <pre class="language-graphql"><code class="language-graphql"><span class="token punctuation">{</span>\n  allPosts <span class="token punctuation">{</span>\n    edges <span class="token punctuation">{</span>\n      node <span class="token punctuation">{</span>\n        id\n        title\n        <span class="token attr-name">author</span><span class="token punctuation">:</span> userByAuthorId <span class="token punctuation">{</span>\n          <span class="token operator">...</span>UserDetails\n        <span class="token punctuation">}</span>\n        comments <span class="token punctuation">{</span>\n          text\n          <span class="token attr-name">author</span><span class="token punctuation">:</span> userByAuthorId <span class="token punctuation">{</span>\n            <span class="token operator">...</span>UserDetails\n            recentComments <span class="token punctuation">{</span>\n              date\n              <span class="token attr-name">post</span><span class="token punctuation">:</span> postByPostId <span class="token punctuation">{</span>\n                title\n                author <span class="token punctuation">{</span>\n                  <span class="token operator">...</span>UserDetails\n                <span class="token punctuation">}</span>\n              <span class="token punctuation">}</span>\n              text\n            <span class="token punctuation">}</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">fragment</span> UserDetails on User <span class="token punctuation">{</span>\n  id\n  username\n  <span class="token attr-name">bio</span><span class="token punctuation">:</span> bioByUserId <span class="token punctuation">{</span>\n    preamble\n    location\n    description\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<h3 id="how-can-i-improve-performance-of-my-postgraphile-api"><a href="#how-can-i-improve-performance-of-my-postgraphile-api" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>How can I improve performance of my PostGraphile API?</h3>\n<p>Chances are that any performance issues you have are coming from your database\nschema, so standard PostgreSQL optimisation techniques apply. Here\'s a few\nthings you might want to try:</p>\n<ul>\n<li>Throw more RAM at your database server</li>\n<li>Make sure your database server is using an SSD</li>\n<li>Make sure you have added the correct type of database indexes in the correct places (references, filters, order-by)</li>\n<li>Note: making a column a reference to a foreign key does <strong>not</strong> add an index to that column, so for example <code class="language-text">User.postsByAuthorId</code> will be slow unless you\'ve manually added an index to <code class="language-text">posts.author_id</code></li>\n<li><code class="language-text">VACUUM</code> your database tables</li>\n<li>Check your RLS policies aren\'t too expensive, consider optimising them</li>\n<li>Optimise your computed column functions</li>\n<li>Consider <code class="language-text">security definer</code> on functions to bypass RLS (but make sure you add your own auth checks!)</li>\n<li>Use the envvar <code class="language-text">DEBUG=graphile-build-pg:sql</code> to show the SQL statements that are being executed; e.g. <code class="language-text">DEBUG=graphile-build-pg:sql postgraphile -c postgres://localhost/mydb</code></li>\n</ul>\n<p>If you need help optimising your PostgreSQL database or PostGraphile API, please <a href="/support/">get in touch</a>.</p>',frontmatter:{path:"/postgraphile/performance/",title:"Performance",showExamples:null}},nav:{edges:[{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [0] >>> JSON",name:"graphile-build",sections:[{id:"guides",title:"Overview"},{id:"library-reference",title:"Using the Library"},{id:"plugin-reference",title:"Building a Plugin"}],pages:[{to:"/graphile-build/getting-started/",title:"Getting Started",sectionId:"guides"},{to:"/graphile-build/plugins/",title:"Plugins",sectionId:"guides"},{to:"/graphile-build/hooks/",title:"Hooks",sectionId:"guides"},{to:"/graphile-build/look-ahead/",title:"Look Ahead",sectionId:"guides"},{to:"/graphile-build/graphile-build/",title:"graphile-build",sectionId:"library-reference"},{to:"/graphile-build/schema-builder/",title:"SchemaBuilder",sectionId:"library-reference"},{to:"/graphile-build/plugin-options/",title:"Options",sectionId:"library-reference"},{to:"/graphile-build/default-plugins/",title:"Default Plugins",sectionId:"library-reference"},{to:"/graphile-build/omitting-plugins/",title:"Omitting Plugins",sectionId:"guides"},{to:"/graphile-build/all-hooks/",title:"All Hooks",sectionId:"plugin-reference"},{to:"/graphile-build/build-object/",title:"Build Object",sectionId:"plugin-reference"},{to:"/graphile-build/context-object/",title:"Context Object",sectionId:"plugin-reference"},{to:"/graphile-build/schema-builder/",title:"SchemaBuilder",sectionId:"plugin-reference"}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [1] >>> JSON",name:"postgraphile",sections:[{id:"overview",title:"Overview"},{id:"guides",title:"Guides"},{id:"usage",title:"Usage"},{id:"community",title:"Community"}],pages:[{to:"/postgraphile/introduction/",title:"Introduction",sectionId:"overview"},{to:"/postgraphile/examples/",title:"Examples",sectionId:"overview"},{to:"/postgraphile/quick-start-guide/",title:"Quick Start Guide",sectionId:"overview"},{to:"/postgraphile/evaluating/",title:"Evaluating for your Project",sectionId:"guides"},{to:"/postgraphile/requirements/",title:"Requirements",sectionId:"overview"},{to:"/postgraphile/performance/",title:"Performance",sectionId:"overview"},{to:"/postgraphile/connections/",title:"Connections",sectionId:"overview"},{to:"/postgraphile/filtering/",title:"Filtering",sectionId:"overview"},{to:"/postgraphile/relations/",title:"Relations",sectionId:"overview"},{to:"/postgraphile/crud-mutations/",title:"CRUD Mutations",sectionId:"overview"},{to:"/postgraphile/computed-columns/",title:"Computed Columns",sectionId:"overview"},{to:"/postgraphile/custom-queries/",title:"Custom Queries",sectionId:"overview"},{to:"/postgraphile/custom-mutations/",title:"Custom Mutations",sectionId:"overview"},{to:"/postgraphile/smart-comments/",title:"Smart Comments",sectionId:"overview"},{to:"/postgraphile/security/",title:"Security",sectionId:"overview"},{to:"/postgraphile/introspection/",title:"Introspection",sectionId:"overview"},{to:"/postgraphile/extending/",title:"Schema Plugins",sectionId:"overview"},{to:"/postgraphile/plugins/",title:"Server Plugins",sectionId:"overview"},{to:"/postgraphile/subscriptions/",title:"Subscriptions",sectionId:"overview"},{to:"/postgraphile/production/",title:"Production Considerations",sectionId:"overview"},{to:"/postgraphile/reserved-keywords/",title:"Reserved Keywords",sectionId:"overview"},{to:"/postgraphile/debugging/",title:"Debugging",sectionId:"overview"},{to:"/postgraphile/jwt-guide/",title:"PostGraphile JWT Guide",sectionId:"guides"},{to:"/postgraphile/default-role/",title:"The Default Role",sectionId:"guides"},{to:"/postgraphile/procedures/",title:"PostgreSQL Procedures",sectionId:"guides"},{to:"/postgraphile/postgresql-schema-design/",title:"PostgreSQL Schema Design",sectionId:"guides"},{to:"/postgraphile/postgresql-indexes/",title:"PostgreSQL Indexes",sectionId:"guides"},{to:"/postgraphile/v4-new-features/",title:"v4 Feature Guide",sectionId:"guides"},{to:"/postgraphile/v3-migration/",title:"v3 → v4 Migration Guide",sectionId:"guides"},{to:"/postgraphile/usage-cli/",title:"CLI Usage",sectionId:"usage"},{to:"/postgraphile/usage-library/",title:"Library Usage",sectionId:"usage"},{to:"/postgraphile/usage-schema/",title:"Schema-only Usage",sectionId:"usage"},{to:"/postgraphile/community-plugins/",title:"Community Plugins",sectionId:"community"},{to:"/postgraphile/community-chat/",title:"Community Chat",sectionId:"community"},{to:"/postgraphile/code-of-conduct/",title:"Code of Conduct",sectionId:"community"}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/nav.json absPath of file [2] >>> JSON",name:"graphile-build-pg",sections:[{id:"usage",title:"Usage"}],pages:[{to:"/postgraphile/settings/",title:"Settings",sectionId:"usage"}]}}]},examples:{edges:[{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [0] >>> JSON",title:"Basic",examples:[{title:"Forums",query:"{\n  allForums {\n    nodes {\n      nodeId\n      id\n      slug\n      name\n      description\n    }\n  }\n}\n",result:'{\n  "allForums": {\n    "nodes": [\n      {\n        "nodeId": "WyJmb3J1bXMiLDFd",\n        "id": 1,\n        "slug": "cat-life",\n        "name": "Cat Life",\n        "description":\n          "A forum all about cats and how fluffy they are and how they completely ignore their owners unless there is food. Or yarn."\n      },\n      {\n        "nodeId": "WyJmb3J1bXMiLDJd",\n        "id": 2,\n        "slug": "dog-life",\n        "name": "Dog Life",\n        "description": ""\n      },\n      {\n        "nodeId": "WyJmb3J1bXMiLDNd",\n        "id": 3,\n        "slug": "slug-life",\n        "name": "Slug Life",\n        "description": ""\n      }\n    ]\n  }\n}\n'},{title:"Forum by slug",query:'{\n  forumBySlug(slug: "slug-life") {\n    nodeId\n    id\n    slug\n    name\n    description\n  }\n}\n',result:'{\n  "forumBySlug": {\n    "nodeId": "WyJmb3J1bXMiLDNd",\n    "id": 3,\n    "slug": "slug-life",\n    "name": "Slug Life",\n    "description": ""\n  }\n}\n'}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [1] >>> JSON",title:"Collections",examples:[{title:"First offset",query:"{\n  allForums(first: 1, offset: 1) {\n    nodes {\n      nodeId\n      id\n      name\n    }\n  }\n}\n",result:'{\n  "allForums": {\n    "nodes": [\n      {\n        "nodeId": "WyJmb3J1bXMiLDJd",\n        "id": 2,\n        "name": "Dog Life"\n      }\n    ]\n  }\n}\n'},{title:"Relation condition",query:'{\n  forumBySlug(slug: "cat-life") {\n    nodeId\n    id\n    name\n    topics(\n      condition: { authorId: 1 }\n    ) {\n      nodes {\n        nodeId\n        id\n        title\n      }\n    }\n  }\n}\n',result:'{\n  "forumBySlug": {\n    "nodeId": "WyJmb3J1bXMiLDFd",\n    "id": 1,\n    "name": "Cat Life",\n    "topics": {\n      "nodes": [\n        {\n          "nodeId":\n            "WyJ0b3BpY3MiLDFd",\n          "id": 1,\n          "title": "cats cats cats"\n        },\n        {\n          "nodeId":\n            "WyJ0b3BpY3MiLDJd",\n          "id": 2,\n          "title": "snooze life"\n        },\n        {\n          "nodeId":\n            "WyJ0b3BpY3MiLDNd",\n          "id": 3,\n          "title": "too hot"\n        }\n      ]\n    }\n  }\n}\n'}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [2] >>> JSON",title:"Relations",examples:[{title:"Forums topics posts",query:"{\n  forumById(id: 1) {\n    name\n    topics(\n      first: 1\n      orderBy: [CREATED_AT_ASC]\n    ) {\n      nodes {\n        id\n        title\n        bodySummary\n        author {\n          id\n          username\n        }\n        posts(\n          first: 1\n          orderBy: [ID_DESC]\n        ) {\n          nodes {\n            id\n            author {\n              id\n              username\n            }\n            body\n          }\n        }\n      }\n    }\n  }\n}\n",result:'{\n  "forumById": {\n    "name": "Cat Life",\n    "topics": {\n      "nodes": [\n        {\n          "id": 1,\n          "title": "cats cats cats",\n          "bodySummary":\n            "lets discuss cats because t...",\n          "author": {\n            "id": 1,\n            "username": "user"\n          },\n          "posts": {\n            "nodes": [\n              {\n                "id": 3,\n                "author": {\n                  "id": 1,\n                  "username": "user"\n                },\n                "body":\n                  "I love it when they completely ignore you until they want something. So much better than dogs am I rite?"\n              }\n            ]\n          }\n        }\n      ]\n    }\n  }\n}\n'}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [3] >>> JSON",title:"Mutations",examples:[{title:"Create",query:'mutation {\n  createTopic(\n    input: {\n      topic: {\n        forumId: 1\n        title: "My question relates to mutations..."\n        body: "How do you write them?"\n      }\n    }\n  ) {\n    topic {\n      nodeId\n      id\n      forumId\n      title\n      body\n    }\n  }\n}\n',result:'{\n  "createTopic": {\n    "topic": {\n      "nodeId": "WyJ0b3BpY3MiLDRd",\n      "id": 4,\n      "forumId": 1,\n      "title":\n        "My question relates to mutations...",\n      "body": "How do you write them?"\n    }\n  }\n}\n'},{title:"Update",query:'mutation {\n  updateTopicById(\n    input: {\n      id: 1\n      topicPatch: {\n        title: "My (edited) title"\n      }\n    }\n  ) {\n    topic {\n      nodeId\n      id\n      title\n      body\n    }\n  }\n}\n',result:'{\n  "updateTopicById": {\n    "topic": {\n      "nodeId": "WyJ0b3BpY3MiLDFd",\n      "id": 1,\n      "title": "My (edited) title",\n      "body":\n        "lets discuss cats because theyre totally cool"\n    }\n  }\n}\n'},{title:"Delete",query:"mutation {\n  deleteTopicById(input: { id: 1 }) {\n    deletedTopicId\n  }\n}\n",result:'{\n  "deleteTopicById": {\n    "deletedTopicId":\n      "WyJ0b3BpY3MiLDFd"\n  }\n}\n'}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [4] >>> JSON",title:"Custom queries",examples:[{title:"Single scalar",query:"{\n  randomNumber\n}\n\n# Generated by SQL like:\n#\n#  create function app_public.random_number() returns int\n#  language sql stable\n#  as $$\n#    select 4; -- Chosen by fair dice roll. Guaranteed to be random. XKCD#221\n#  $$;\n#\n",result:'{ "randomNumber": 4 }\n'},{title:"Single row",query:"{\n  currentUser {\n    nodeId\n    id\n    username\n  }\n}\n\n# Added to the GraphQL schema via\n# this SQL:\n#\n#   create function current_user()\n#   returns app_public.users\n#   language sql stable\n#   as $$\n#     select users.*\n#     from app_public.users\n#     where id = current_user_id();\n#   $$;\n",result:'{\n  "currentUser": {\n    "nodeId": "WyJ1c2VycyIsMV0=",\n    "id": 1,\n    "username": "user"\n  }\n}\n'},{title:"Rows connection",query:"{\n  forumsAboutCats {\n    nodes {\n      nodeId\n      id\n      name\n      slug\n    }\n  }\n}\n\n# Created from SQL like:\n#\n#  create function app_public.forums_about_cats()\n#  returns setof app_public.forums\n#  language sql stable\n#  as $$\n#    select *\n#    from app_public.forums\n#    where slug like 'cat-%';\n#  $$;\n",result:'{\n  "forumsAboutCats": {\n    "nodes": [\n      {\n        "nodeId": "WyJmb3J1bXMiLDFd",\n        "id": 1,\n        "name": "Cat Life",\n        "slug": "cat-life"\n      }\n    ]\n  }\n}\n'}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [5] >>> JSON",title:"Custom mutations",examples:[{title:"Forgot password",query:"mutation {\n  forgotPassword(\n    input: {\n      email: \"user@example.com\"\n    }\n  ) {\n    success\n  }\n}\n\n# Generated with SQL like this:\n#\n#  create function forgot_password(email text)\n#  returns boolean\n#  language plpgsql volatile\n#  as $$\n#    ...\n#  $$;\n#\n#  -- Optionally rename the result field:\n#  comment on function\n#    forgot_password(email text)\n#    is '@resultFieldName success';\n",result:'{\n  "forgotPassword": {\n    "success": true\n  }\n}\n'}]}},{node:{id:"/Users/benjiegillam/Dev/graphile.org/src/data/examples.json absPath of file [6] >>> JSON",title:"Computed columns",examples:[{title:"Topic summary",query:"{\n  topicById(id: 2) {\n    body\n    bodySummary\n  }\n}\n\n# Generated by SQL like:\n#\n#  create function app_public.topics_body_summary(\n#    t app_public.topics,\n#    max_length int = 30\n#  )\n#  returns text\n#  language sql stable\n#  as $$\n#    select case\n#      when length(t.body) > max_length\n#      then left(t.body, max_length - 3)\n#             || '...'\n#      else t.body\n#      end;\n#  $$;\n",result:'{\n  "topicById": {\n    "body":\n      "do you find your cat just sleeps everywhere",\n    "bodySummary":\n      "do you find your cat just s..."\n  }\n}\n'},{title:"Topic summary with arg",query:"{\n  topicById(id: 2) {\n    body\n    bodySummary(maxLength: 20)\n  }\n}\n\n# Generated by SQL like:\n#\n#  create function app_public.topics_body_summary(\n#    t app_public.topics,\n#    max_length int = 30\n#  )\n#  returns text\n#  language sql stable\n#  as $$\n#    select case\n#      when length(t.body) > max_length\n#      then left(t.body, max_length - 3)\n#             || '...'\n#      else t.body\n#      end;\n#  $$;\n",result:'{\n  "topicById": {\n    "body":\n      "do you find your cat just sleeps everywhere",\n    "bodySummary":\n      "do you find your ..."\n  }\n}\n'}]}}]}},pathContext:{layout:"page"}}}});
//# sourceMappingURL=path---postgraphile-performance-75b8fe5c06705c3fb952.js.map