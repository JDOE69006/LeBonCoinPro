(function () {
  "use strict";
  const no = "info",
    ro = (error, context = {}) => console.error("LebonCoinPro:", context.action || "error", error),
    oo = (message, level = no, data = {}) => console[level]?.("LebonCoinPro:", message, data);  const so = {
      version: "1.3.5",
      selectors: {
        adContainer: 'li[data-qa-id="ad_item_container"]',
        adLink: 'a[href*="/ad/"]',
        buttonContainer: ".mt-md.gap-md.flex.flex-wrap",
        republishButton: "[data-lbc-republish-btn]",
        adListContainer: '[data-test-id="ad-list-container"]',
        articleCloneButton: "[data-lbc-detail-clone-btn]",
      },
      pausedAdText: "mise en pause",
      delays: {
        buttonInjection: 500,
        pageReload: 3e3,
        notificationFade: 6e3,
        notificationError: 1e4,
        beforeSubmit: 1e3,
        fadeOut: 300,
        retryAttempts: [1e3, 2e3, 3e3, 5e3],
      },
      throttle: {
        betweenStepsMinMs: 400,
        betweenStepsMaxMs: 1200,
        cooldownMs: 2e3,
        backoffBaseMs: 2e4,
        backoffMaxMs: 3e4,
      },
      tracking: { dd: "app:308.2" },
      api: {
        baseUrl: "https://api.leboncoin.fr",
        adData: (t) =>
          `https://api.leboncoin.fr/api/pintad/v1/public/manual/classified/${t}`,
        deleteAd:
          "https://api.leboncoin.fr/api/pintad/v1/public/manual/delete/ads",
        createAd:
          "https://api.leboncoin.fr/api/adsubmit/v2/classifieds?with_variation=true",
        createDraft: "https://api.leboncoin.fr/api/ad-draft/v1/draft",
        pricing: "https://api.leboncoin.fr/api/options/v4/pricing/classifieds",
        submit: "https://api.leboncoin.fr/api/services/v4/submit",
      },
      headers: {
        accept: "*/*",
        acceptLanguage: "fr-FR,fr;q=0.9",
        contentType: "application/json",
        origin: "https://www.leboncoin.fr",
        deleteApiKey: "ba0c2dad52b3ec",
      },
      referers: {
        deposit: "https://www.leboncoin.fr/deposer-une-annonce",
        options: "https://www.leboncoin.fr/deposer-une-annonce/options",
        deletion: "https://www.leboncoin.fr/compte/mes-annonces/suppression",
      },
      pages: {
        draftEdit: (t) => `https://www.leboncoin.fr/brouillon/${t}/finaliser`,
      },
      readOnlyFields: [
        "list_id",
        "ad_id",
        "first_publication_date",
        "index_date",
        "status",
        "url",
        "price",
      ],
      readOnlyAttributes: ["draft_id"],
    },
    io = (t) => {
      const e = document.createElement("div");
      return ((e.textContent = t), e.innerHTML);
    },
    ao = (t) => {
      const e = document.cookie.match(new RegExp(`${t}=([^;]+)`));
      return e ? e[1] : null;
    },
    Zo = () => {
      try {
        return !!(ao("luat") || localStorage.getItem("luat"));
      } catch {
        return !1;
      }
    },
    co = (t) => new Promise((e) => setTimeout(e, t)),
    uo = (t, e) => co(t + Math.random() * (e - t));
  const lo = {
      create(t) {
        const e = document.createElement("div");
        return (
          (e.id = t.id),
          (e.style.cssText = `\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      background: #2b2d31;\n      color: ${t.color || "#e4e4e7"};\n      padding: 12px 16px;\n      border-radius: 6px;\n      box-shadow: 0 4px 16px rgba(0,0,0,0.4);\n      z-index: 999999;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;\n      font-size: 13px;\n      font-weight: 500;\n      border-left: 3px solid ${t.borderColor || "#6b7280"};\n      max-width: 320px;\n      line-height: 1.4;\n      display: flex;\n      align-items: flex-start;\n      gap: 10px;\n    `),
          (e.innerHTML = `\n      <img src="data:image/png;base64,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" width="20" height="20" style="flex-shrink: 0; margin-top: 1px; border-radius: 4px;" alt="LBC" />\n      <div style="flex: 1;">${t.content}</div>\n    `),
          e
        );
      },
      show: (t) => (document.body.appendChild(t), t),
      remove(t) {
        const e = document.getElementById(t);
        e?.remove();
      },
      removeMultiple(...t) {
        t.forEach((t) => this.remove(t));
      },
      fadeOut(t, e) {
        setTimeout(() => {
          ((t.style.transition = "opacity 0.3s"),
            (t.style.opacity = "0"),
            setTimeout(() => t.remove(), so.delays.fadeOut));
        }, e);
      },
      loading(t = "Chargement...") {
        return this.create({
          id: "lbc-loading",
          borderColor: "#ff8a4a",
          color: "#e4e4e7",
          content: t,
        });
      },
      deleting() {
        return this.create({
          id: "lbc-deleting",
          borderColor: "#ec5a13",
          color: "#e4e4e7",
          content: "Suppression de l'ancienne annonce...",
        });
      },
      publishing() {
        return this.create({
          id: "lbc-publishing",
          borderColor: "#ff8a4a",
          color: "#e4e4e7",
          content: "Publication de la nouvelle annonce...",
        });
      },
      creatingDraft() {
        return this.create({
          id: "lbc-drafting",
          borderColor: "#ff8a4a",
          color: "#e4e4e7",
          content: "Création du brouillon...",
        });
      },
      draftSuccess(t) {
        return this.create({
          id: "lbc-draft-success",
          borderColor: "#10b981",
          color: "#e4e4e7",
          content: `\n        <div style="font-weight: 600; margin-bottom: 6px;">Brouillon créé</div>\n        <div style="font-size: 12px; color: #a1a1aa;">\n          L'annonce originale reste en ligne.\n          <a href="${io(t)}" target="_blank" style="color: #ff8a4a; text-decoration: underline;">Ouvrir le brouillon</a>\n        </div>\n      `,
        });
      },
      success(t) {
        return this.create({
          id: "lbc-success",
          borderColor: "#10b981",
          color: "#e4e4e7",
          content: `\n        <div style="font-weight: 600; margin-bottom: 6px;">Republication réussie</div>\n        <div style="font-size: 12px; color: #a1a1aa;">\n          Annonce #${io(String(t))} créée avec succès, rafraîchissez la page.\n        </div>\n      `,
        });
      },
      error(t) {
        return this.create({
          id: "lbc-error",
          borderColor: "#ef4444",
          color: "#e4e4e7",
          content: `\n        <div style="font-weight: 600; margin-bottom: 6px;">Erreur</div>\n        <div style="font-size: 12px; color: #a1a1aa;">${io(t)}</div>\n      `,
        });
      },
      info(t) {
        return this.create({
          id: "lbc-info",
          borderColor: "#6b7280",
          color: "#e4e4e7",
          content: io(t),
        });
      },
      warning(t) {
        return this.create({
          id: "lbc-warning",
          borderColor: "#f59e0b",
          color: "#fef3c7",
          content: io(t),
        });
      },
    },
    po = () => {
      const t = "luat",
        e = ao(t) || localStorage.getItem(t);
      if (!e) {
        const t = new Error(
          "Token d'authentification non trouvé, essayez de vous reconnecter",
        );
        throw (ro(t, { action: "getAuthToken" }), t);
      }
      return e;
    },
    fo = () => {
      const t = { version: 1, rollout_visitor_id: ao("cnfdVisitorId") || "" };
      return btoa(JSON.stringify(t));
    },
    ho = (t, e, n) => ({
      accept: so.headers.accept,
      "accept-language": so.headers.acceptLanguage,
      authorization: `Bearer ${t}`,
      "content-type": so.headers.contentType,
      origin: so.headers.origin,
      referer: n,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-lbc-experiment": e,
    }),
    mo = (t) => {
      const e = {
        ...t,
        tracking_dd: so.tracking.dd,
        price_cents:
          "number" == typeof t.price
            ? Math.round(100 * t.price).toString()
            : t.price_cents,
      };
      return (
        so.readOnlyFields.forEach((t) => delete e[t]),
        "attributes" in e &&
          (e.attributes = ((t) => {
            if (Array.isArray(t))
              return t.filter(
                ({ key: t }) => !so.readOnlyAttributes.includes(t),
              );
            if (t && "object" == typeof t) {
              const e = { ...t };
              return (so.readOnlyAttributes.forEach((t) => delete e[t]), e);
            }
            return t;
          })(e.attributes)),
        e
      );
    },
    go = async (t, e) => {
      if (!t.ok) {
        const n = await t.text(),
          r = new Error(`Erreur ${e}: ${t.status} ${n}`);
        throw (
          (r.status = t.status),
          ro(r, { status: t.status, action: e }),
          r
        );
      }
      return t;
    },
    yo = async (t) => {
      oo("Fetching ad data", no);
      const e = po(),
        n = await fetch(so.api.adData(t), {
          method: "GET",
          headers: {
            accept: so.headers.accept,
            authorization: `Bearer ${e}`,
            "content-type": so.headers.contentType,
          },
          credentials: "include",
        });
      await go(n, "fetchAdData");
      return await n.json();
    },
    _o = async (t) => {
      oo("Deleting ad", no);
      const e = po(),
        n = await fetch(so.api.deleteAd, {
          method: "DELETE",
          headers: {
            accept: so.headers.accept,
            api_key: so.headers.deleteApiKey,
            authorization: `Bearer ${e}`,
            "content-type": so.headers.contentType,
            origin: so.headers.origin,
            referer: so.referers.deletion,
          },
          body: JSON.stringify({ list_ids: [parseInt(t, 10)] }),
          credentials: "include",
        });
      await go(n, "deleteAd");
    },
    vo = async (t) => {
      oo("Creating draft via API", no, {
        category: t.category_name,
        price: t.price,
      });
      const e = po(),
        n = fo(),
        r = mo(t),
        o = {
          ...r,
          attributes: {
            ...((s = r.attributes),
            Array.isArray(s)
              ? Object.fromEntries(s.map(({ key: t, value: e }) => [t, e]))
              : s || {}),
            ad_submission_id: crypto.randomUUID(),
            ad_submission_source: "insertion-dynamic-v1",
          },
        };
      var s;
      await uo(so.throttle.betweenStepsMinMs, so.throttle.betweenStepsMaxMs);
      const i = await fetch(so.api.createDraft, {
        method: "POST",
        headers: ho(e, n, so.referers.deposit),
        credentials: "include",
        body: JSON.stringify(o),
      });
      await go(i, "createDraftViaAPI");
      const a = await i.json();
      if (!a.draft_id) throw new Error("Pas de draft_id dans la réponse");
      return (oo("Successfully created draft", no), a.draft_id);
    },
    bo = async (t) => {
      oo("Creating ad via API", no, {
        category: t.category_name,
        price: t.price,
      });
      const e = po(),
        n = fo(),
        r = mo(t);
      await uo(so.throttle.betweenStepsMinMs, so.throttle.betweenStepsMaxMs);
      const { ad_id: o, action_id: s } = await (async (t, e, n) => {
        const r = await fetch(so.api.createAd, {
          method: "POST",
          headers: ho(e, n, so.referers.deposit),
          credentials: "include",
          body: JSON.stringify(t),
        });
        if (400 === r.status) {
          const t = await r.text(),
            e = new Error(
              "Cette annonce est trop ancienne pour être republiée directement : des champs désormais obligatoires sont manquants. Utilisez « Modifier avant republication (brouillon) » pour compléter les champs manquants, puis republiez.",
            );
          throw (
            (e.status = 400),
            ro(e, { status: 400, action: "createAdDraft", errorText: t }),
            e
          );
        }
        await go(r, "createAdDraft");
        const o = await r.json();
        if (!o.ad_id) throw new Error("Pas d'ad_id dans la réponse");
        return { ad_id: o.ad_id, action_id: o.action_id || 1 };
      })(r, e, n);
      await uo(so.throttle.betweenStepsMinMs, so.throttle.betweenStepsMaxMs);
      const i = await (async (t, e, n, r, o) => {
        const s = {
            user_journey: "deposit",
            page_name: "option",
            classifieds: [{ ad_id: t, category: n.toString(), action_id: e }],
            is_edit_refused: !1,
          },
          i = await fetch(so.api.pricing, {
            method: "POST",
            headers: ho(r, o, so.referers.options),
            credentials: "include",
            body: JSON.stringify(s),
          });
        await go(i, "fetchPricingId");
        const a = await i.json();
        if (!a.pricing_id) throw new Error("Pas de pricing_id dans la réponse");
        return a.pricing_id;
      })(o, s, r.category_id, e, n);
      return (
        await (async (t, e, n, r, o, s) => {
          const i = {
            ads: [
              {
                ad_type: n,
                ad_id: t,
                options: [],
                action_id: e,
                transaction_type: "new_ad",
              },
            ],
            pricing_id: r,
            user_journey: "deposit",
          };
          await co(so.delays.beforeSubmit);
          const a = await fetch(so.api.submit, {
            method: "POST",
            headers: ho(o, s, so.referers.options),
            credentials: "include",
            body: JSON.stringify(i),
          });
          (await go(a, "publishAd"), await a.json());
        })(o, s, r.ad_type, i, e, n),
        oo("Successfully created ad", no, { price: t.price }),
        o
      );
    };
  let extensionSettings = {
      dashboardButtons: !0,
      articleCloneButton: !0,
    },
    wo = !1,
    Eo = 0,
    xo = 0;
  const So = async (t, e) => {
      if (wo) {
        const t = lo.show(lo.info("Une action est déjà en cours, patientez…"));
        return void lo.fadeOut(t, so.delays.notificationFade);
      }
      const n = Eo - Date.now();
      if (n > 0) {
        const t = lo.show(
          lo.info(
            `Patientez encore ${Math.ceil(n / 1e3)} s avant une nouvelle action.`,
          ),
        );
        return void lo.fadeOut(t, so.delays.notificationFade);
      }
      wo = !0;
      try {
        if (!(await e())) return;
        ((xo = 0),
          (Eo =
            Date.now() +
            so.throttle.cooldownMs +
            Math.random() * so.throttle.betweenStepsMaxMs));
      } catch (e) {
        (ro(e, { action: t, step: "workflow" }), (xo += 1));
        const n = Math.min(
          so.throttle.backoffBaseMs * 2 ** (xo - 1),
          so.throttle.backoffMaxMs,
        );
        ((Eo = Date.now() + (403 === e.status ? so.throttle.backoffMaxMs : n)),
          lo.removeMultiple(
            "lbc-loading",
            "lbc-deleting",
            "lbc-publishing",
            "lbc-drafting",
          ));
        const r = lo.show(lo.error(e.message));
        setTimeout(() => r.remove(), so.delays.notificationError);
      } finally {
        wo = !1;
      }
    },
    ko = async (t) => {
      oo("Starting republish process", no);
      const e = lo.show(lo.loading("Chargement des données...")),
        n = await yo(t);
      e.remove();
      const r = ((t) => {
        const e = prompt(
          `Prix actuel: ${t} €\n\nEntrez le nouveau prix (en euros) ou laissez vide pour garder le prix actuel:`,
          t,
        );
        if (null === e) return null;
        if ("" === e.trim()) return t;
        const n = parseFloat(e.trim());
        if (isNaN(n) || n <= 0)
          throw new Error("Prix invalide. Veuillez entrer un nombre positif.");
        return n;
      })(n.price);
      if (null === r) return (oo("Republish cancelled by user", no), !1);
      const o = { ...n, price: r };
      if (
        !((t) =>
          confirm(
            `✅ Prêt à republier:\n\n📋 ${t.subject}\n💰 ${t.price} €\n📁 ${t.category_name}\n\nLancer la republication automatique?`,
          ))(o)
      )
        return (oo("Republish cancelled by user confirmation", no), !1);
      const s = lo.show(lo.publishing()),
        i = await bo(o);
      s.remove();
      const a = lo.show(lo.deleting());
      (await _o(t), a.remove());
      const c = lo.show(lo.success(i));
      return (
        lo.fadeOut(c, so.delays.notificationFade),
        oo("Republish completed successfully", no),
        !0
      );
    },
    Ao = async (t) => {
      oo("Starting modify-draft process", no);
      const e = lo.show(lo.loading("Chargement des données...")),
        n = await yo(t);
      if (
        (e.remove(),
        !((t) =>
          confirm(
            `📝 Modifier avant republication:\n\n📋 ${t.subject}\n💰 ${t.price} €\n📁 ${t.category_name}\n\nL'ancienne annonce sera supprimée et vous serez redirigé vers le brouillon. Continuer?`,
          ))(n))
      )
        return (oo("Modify-draft cancelled by user confirmation", no), !1);
      const r = lo.show(lo.creatingDraft()),
        o = await vo(n);
      r.remove();
      const s = lo.show(lo.deleting());
      return (
        await _o(t),
        s.remove(),
        oo("Modify-draft completed successfully", no),
        window.location.assign(so.pages.draftEdit(o)),
        !0
      );
    },
    Co = async (t) => {
      oo("Starting clone process", no);
      const e = lo.show(lo.loading("Chargement des données...")),
        n = await yo(t);
      if (
        (e.remove(),
        !((t) =>
          confirm(
            `🐑 Cloner en brouillon:\n\n📋 ${t.subject}\n💰 ${t.price} €\n📁 ${t.category_name}\n\nUn brouillon sera créé, l'annonce originale restera en ligne. Continuer?`,
          ))(n))
      )
        return (oo("Clone cancelled by user confirmation", no), !1);
      const r = lo.show(lo.creatingDraft()),
        o = await vo(n);
      r.remove();
      const s = lo.show(lo.draftSuccess(so.pages.draftEdit(o)));
      return (
        lo.fadeOut(s, so.delays.notificationFade),
        oo("Clone completed successfully", no),
        !0
      );
    },
    Uo = (t, group, reference) => {
      const wrapper = document.createElement("div"),
        referenceRect = reference.getBoundingClientRect(),
        groupRect = group.getBoundingClientRect();
      wrapper.style.cssText = `display:flex; flex:0 0 auto; width:${groupRect.width}px; max-width:100%; margin-top:8px;`;
      wrapper.innerHTML = `
        <button data-lbc-detail-clone-btn="${t}" type="button" aria-disabled="${!Zo()}" title="${Zo() ? "Créer un brouillon à partir de cette annonce" : "Connectez-vous à votre compte Leboncoin pour cloner cette annonce"}" style="box-sizing:border-box; width:100%; height:${referenceRect.height || 40}px; min-height:${referenceRect.height || 40}px; padding:9px 14px; border:0; border-radius:999px; background:linear-gradient(135deg,#db2777,#9333ea); color:#fff; font:600 13px system-ui,sans-serif; cursor:${Zo() ? "pointer" : "not-allowed"}; opacity:${Zo() ? "1" : ".65"};">📄 Cloner l'annonce</button>
      `;
      const n = wrapper.querySelector(so.selectors.articleCloneButton);
      return (
        n.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!Zo()) {
            const t = lo.show(
              lo.warning(
                "Connectez-vous à votre compte Leboncoin avant de cloner cette annonce.",
              ),
            );
            return void lo.fadeOut(t, so.delays.notificationFade);
          }
          So("handleDetailCloneClick", () => Co(n.dataset.lbcDetailCloneBtn));
        }),
        wrapper
      );
    },
    Oo = (t) => {
      const e = document.createElement("div");
      e.dataset.lbcDashboardActions = "true";
      e.style.cssText = "display:flex; flex:1 1 100%; flex-wrap:wrap; gap:8px; width:100%;";
      e.innerHTML = `
        <button data-lbc-republish-btn="${t}" type="button" title="Republier cette annonce" style="flex:0 0 auto; min-height:40px; padding:9px 14px; border:0; border-radius:999px; background:linear-gradient(135deg,#7c3aed,#a855f7); color:#fff; font:600 13px system-ui,sans-serif; cursor:pointer;">✨ Republier</button>
        <button data-lbc-modify-draft-btn type="button" title="Créer un brouillon à modifier avant republication" style="flex:0 0 auto; min-height:40px; padding:9px 14px; border:0; border-radius:999px; background:linear-gradient(135deg,#a855f7,#d946ef); color:#fff; font:600 13px system-ui,sans-serif; cursor:pointer;">✏️ Modifier avant republication</button>
        <button data-lbc-clone-btn type="button" title="Créer un brouillon sans supprimer l'annonce originale" style="flex:0 0 auto; min-height:40px; padding:9px 14px; border:0; border-radius:999px; background:linear-gradient(135deg,#db2777,#f472b6); color:#fff; font:600 13px system-ui,sans-serif; cursor:pointer;">📄 Cloner</button>
      `;
      const n = e.querySelector("[data-lbc-republish-btn]"),
        r = e.querySelector("[data-lbc-modify-draft-btn]"),
        o = e.querySelector("[data-lbc-clone-btn]");
      return (
        n.addEventListener("click", () =>
          So("handleRepublishClick", () => ko(t)),
        ),
        r.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          So("handleModifyDraftClick", () => Ao(t));
        }),
        o.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          So("handleCloneClick", () => Co(t));
        }),
        e
      );
    },
    Po = (t) => {
      if (t.querySelector(so.selectors.republishButton)) return !1;
      if (((t) => t.textContent?.toLowerCase().includes(so.pausedAdText))(t))
        return !1;
      const e = t.querySelector(so.selectors.adLink);
      if (!e) return !1;
      const n = ((t) => {
        const e = t?.match(/\/(\d+)$/);
        return e ? e[1] : null;
      })(e.getAttribute("href"));
      if (!n) return !1;
      const r = t.querySelector(so.selectors.buttonContainer);
      return !!r && { listId: n, buttonContainer: r };
    },
    jo = () => {
      try {
        if (!extensionSettings.dashboardButtons) {
          document
            .querySelectorAll("[data-lbc-dashboard-actions]")
            .forEach((t) => t.remove());
          return;
        }
        const t = document.querySelectorAll(so.selectors.adContainer);
        let e = 0;
        (t.forEach((t) => {
          const n = Po(t);
          if (n) {
            const { listId: t, buttonContainer: r } = n,
              o = Oo(t);
            (r.appendChild(o), e++);
          }
        }),
          e > 0 && oo("Injected buttons", no, { count: e, total: t.length }));
      } catch (t) {
        ro(t, { action: "injectRepublishButtons" });
      }
    },
    To = ((t, e) => {
      let n;
      return (...r) => {
        (clearTimeout(n), (n = setTimeout(() => t(...r), e)));
      };
    })(jo, so.delays.buttonInjection),
    Do = () => {
      const t = new MutationObserver((t) => {
          ((t) =>
            t.some((t) =>
              Array.from(t.addedNodes).some(
                (t) =>
                  1 === t.nodeType &&
                  (t.matches?.(so.selectors.adContainer) ||
                    t.querySelector?.(so.selectors.adContainer)),
              ),
            ))(t) && To();
        }),
        e =
          document.querySelector(so.selectors.adListContainer) || document.body;
      t.observe(e, { childList: !0, subtree: !0 });
    };
  let articleObserverStarted = !1,
    articleInjectionTimer = 0;
  const injectArticleCloneButton = () => {
      if (!extensionSettings.articleCloneButton) {
        document
          .querySelectorAll(so.selectors.articleCloneButton)
          .forEach((t) => t.parentElement?.remove());
        return;
      }
      if (!window.location.pathname.startsWith("/ad/")) return;
      const t = window.location.pathname.match(/\/(\d+)\/?$/)?.[1];
      if (!t) return;
      const e = Array.from(
          document.querySelectorAll('button,a,[role="button"]'),
        ),
        n = (t) =>
          [
            t.getAttribute("data-qa-id"),
            t.getAttribute("data-testid"),
            t.getAttribute("aria-label"),
            t.getAttribute("title"),
            t.textContent,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        r = e.find((t) =>
          /shipping|livraison|livrer|envoi|expedition/.test(n(t)),
        ),
        o = e.find((t) =>
          /face.?to.?face|main propre|retrait sur place|remise en main/.test(
            n(t),
          ),
        );
      const ownerControl = e.find((t) => {
        const e = [
            t.getAttribute("data-qa-id"),
            t.getAttribute("data-testid"),
            t.getAttribute("aria-label"),
            t.getAttribute("title"),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
          r = (t.textContent || "")
            .trim()
            .toLowerCase()
            .replace(/[’]/g, "'")
            .replace(/\s+/g, " ");
        return (
          /(?:ad|annonce|listing|classified).*(?:edit|modify|delete|pause|manage|modifier|supprimer|gérer)|(?:edit|modify|delete|pause|manage|modifier|supprimer|gérer).*(?:ad|annonce|listing|classified)/.test(
            e,
          ) ||
          /^(?:modifier|supprimer|mettre en pause|gérer)\s+(?:mon|ma|cette|l')?\s*annonce$/.test(
            r,
          )
        );
      });
      if (!ownerControl) {
        document
          .querySelectorAll(so.selectors.articleCloneButton)
          .forEach((t) => t.parentElement?.remove());
        return;
      }
      let s =
        r && o && r !== o
          ? r.closest(".gap-sm.flex.flex-col")
          : ownerControl.closest(".gap-sm.flex.flex-col");
      if (r && o && r !== o && (!s || !s.contains(o))) {
        s = r.parentElement;
        while (s && s !== document.body && !s.contains(o))
          s = s.parentElement;
      }
      if (!s) s = ownerControl.parentElement;
      if (!s || s === document.body || !s.parentElement) return;
      const i = s.parentElement.querySelector(
        so.selectors.articleCloneButton,
      );
      if (i?.dataset.lbcDetailCloneBtn === t) return;
      i?.parentElement?.remove();
      s.insertAdjacentElement("afterend", Uo(t, s, r));
      oo("Injected article clone button", no, { adId: t });
    },
    initializeArticleCloneButton = () => {
      if (!document.body) return;
      if (!articleObserverStarted) {
        const t = () => {
          clearTimeout(articleInjectionTimer);
          articleInjectionTimer = setTimeout(
            injectArticleCloneButton,
            so.delays.buttonInjection,
          );
        };
        new MutationObserver(t).observe(document.body, {
          childList: !0,
          subtree: !0,
        });
        articleObserverStarted = !0;
      }
      (injectArticleCloneButton(),
        so.delays.retryAttempts.forEach((t) =>
          setTimeout(injectArticleCloneButton, t),
        ));
    };
  document.addEventListener("lbcpro:settings", (t) => {
    try {
      const e = JSON.parse(t.detail);
      extensionSettings = {
        dashboardButtons: e.dashboardButtons !== !1,
        articleCloneButton: e.articleCloneButton !== !1,
      };
      if (window.location.pathname.startsWith("/compte/part/mes-annonces"))
        jo();
      if (window.location.pathname.startsWith("/ad/"))
        injectArticleCloneButton();
    } catch (t) {
      ro(t, { action: "applySettings" });
    }
  });
  let Mo = !1;
  const Lo = () => {
    if (window.location.pathname.startsWith("/ad/")) {
      const t = initializeArticleCloneButton;
      "loading" === document.readyState
        ? document.addEventListener("DOMContentLoaded", t, { once: !0 })
        : t();
    }
    if (window.location.pathname.startsWith("/compte/part/mes-annonces") && !Mo)
      try {
        oo("Initializing Leboncoin Republish extension", no, {
          version: so.version,
        });
        const t = () => {
          (Do(),
            so.delays.retryAttempts.forEach((t) => {
              setTimeout(jo, t);
            }),
            (Mo = !0));
        };
        "loading" === document.readyState
          ? document.addEventListener("DOMContentLoaded", t)
          : t();
      } catch (t) {
        ro(t, { action: "initialize" });
      }
  };
  window.addEventListener("popstate", () => {
    ((Mo = !1), Lo());
  });
  const $o = history.pushState;
  history.pushState = function (...t) {
    ($o.apply(this, t), (Mo = !1), setTimeout(Lo, 100));
  };
  const Ro = history.replaceState;
  ((history.replaceState = function (...t) {
    (Ro.apply(this, t), (Mo = !1), setTimeout(Lo, 100));
  }),
    Lo());
})();
