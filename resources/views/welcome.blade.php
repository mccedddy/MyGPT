<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        @fonts

        <!-- Styles / Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-slate-950 text-slate-100">
        <div class="relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.2),_transparent_20%)] opacity-80"></div>
            <div class="relative px-6 py-10 lg:px-12 lg:py-16">
                <nav class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto">
                    <div class="flex items-center justify-between gap-4">
                        <a href="/" class="text-lg font-semibold tracking-wide text-white">MyGPT</a>
                        @if (Route::has('login'))
                            <div class="flex items-center gap-3">
                                @auth
                                    <a href="{{ url('/dashboard') }}" class="text-sm font-medium text-cyan-100 hover:text-white">Dashboard</a>
                                @else
                                    <a href="{{ route('login') }}" class="text-sm font-medium text-cyan-100 hover:text-white">Log in</a>
                                    @if (Route::has('register'))
                                        <a href="{{ route('register') }}" class="text-sm font-medium text-cyan-100 hover:text-white">Register</a>
                                    @endif
                                @endauth
                            </div>
                        @endif
                    </div>
                    <a href="/mygpt" class="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400">Go to MyGPT</a>
                </nav>

                <main class="mx-auto mt-20 max-w-5xl text-center">
                    <p class="text-sm uppercase tracking-[0.35em] text-cyan-200/70">AI chat powered by Laravel</p>
                    <h1 class="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">A smarter chat landing page for your AI workflow</h1>
                    <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Explore a polished hero experience, then jump straight into your MyGPT chat page with a single click.</p>
                    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                        <a href="/mygpt" class="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-slate-100">Open MyGPT</a>
                        <span class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-6 py-3 text-sm text-slate-200">Built for fast local dev</span>
                    </div>
                </main>

                <section class="mt-14 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                    <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md text-left">
                        <h2 class="text-xl font-semibold text-white">Laravel resources</h2>
                        <p class="mt-3 text-sm leading-6 text-slate-300">Everything you need to explore the full Laravel ecosystem while using MyGPT.</p>
                        <ul class="mt-6 space-y-3 text-sm text-slate-200">
                            <li class="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                                <a href="https://laravel.com/docs" target="_blank" class="font-medium text-cyan-200 hover:text-white">Laravel Documentation</a>
                                <p class="mt-1 text-slate-400">Official docs for routes, views, and app setup.</p>
                            </li>
                            <li class="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                                <a href="https://laracasts.com" target="_blank" class="font-medium text-cyan-200 hover:text-white">Laracasts tutorials</a>
                                <p class="mt-1 text-slate-400">Learn Laravel and frontend tooling with video lessons.</p>
                            </li>
                            <li class="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
                                <a href="https://cloud.laravel.com" target="_blank" class="font-medium text-cyan-200 hover:text-white">Deploy now</a>
                                <p class="mt-1 text-slate-400">Deploy the project quickly with Laravel Forge or Vapor.</p>
                            </li>
                        </ul>
                        <p class="mt-6 text-sm text-slate-400">v{{ app()->version() }} • <span class="font-medium text-slate-200">Laravel</span></p>
                    </div>
                    <div class="grid gap-6 sm:grid-cols-2">
                        <article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
                            <h3 class="text-xl font-semibold text-white">Clean startup</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-300">A focused homepage with hero messaging and a clear path into the app.</p>
                        </article>
                        <article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
                            <h3 class="text-xl font-semibold text-white">Simple CTA</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-300">The hero button gives fast access to the chat UI without extra navigation.</p>
                        </article>
                        <article class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md sm:col-span-2">
                            <h3 class="text-xl font-semibold text-white">Fast routing</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-300">Your root route now welcomes users and sends them directly to <code class="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-200">/mygpt</code>.</p>
                        </article>
                    </div>
                </section>

                <div class="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm uppercase tracking-[0.35em] text-cyan-200/70">Ready to begin?</p>
                            <p class="mt-2 text-2xl font-semibold text-white">Click below to enter the MyGPT experience.</p>
                        </div>
                        <a href="/mygpt" class="inline-flex items-center justify-center rounded-full bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Launch MyGPT</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
