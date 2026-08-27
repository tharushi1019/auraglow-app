# 🚀 AuraGlow — GitHub Repository Setup Guide
## Step-by-Step: Create Repo, Branches & Branch Protection

---

## ✅ STEP 1: Initialize Git & First Commit

Run these commands in the `auraglow-app/` directory:

```powershell
cd "D:\Ecommerce CA\auraglow-app"

git init
git add .
git commit -m "🎉 init: AuraGlow project scaffolding — all modules, design system, DB schema"
```

---

## ✅ STEP 2: Create GitHub Repository

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name**: `auraglow-app`
   - **Description**: `AuraGlow - Personalized Clean Beauty & Skincare E-Commerce Platform`
   - **Visibility**: Private (recommended for academic work)
   - **DO NOT** check "Add README" — we already have one
3. Click **"Create repository"**
4. Copy the repo URL (e.g., `https://github.com/YOUR_USERNAME/auraglow-app.git`)

---

## ✅ STEP 3: Push main Branch

```powershell
git remote add origin https://github.com/YOUR_USERNAME/auraglow-app.git
git branch -M main
git push -u origin main
```

---

## ✅ STEP 4: Push the `develop` Integration Branch

```powershell
git checkout develop
git push -u origin develop
```

---

## ✅ STEP 5: Push All Feature Branches

```powershell
# Module 1 — Dinu
git checkout feature/auth-profile
git push -u origin feature/auth-profile
git checkout develop

# Module 2 — Keshara
git checkout feature/product-catalog
git push -u origin feature/product-catalog
git checkout develop

# Module 3 — Achani
git checkout feature/cart-wishlist
git push -u origin feature/cart-wishlist
git checkout develop

# Module 4 — Maduni
git checkout feature/review-recommendation
git push -u origin feature/review-recommendation
git checkout develop

# Module 5 — Kaveesha
git checkout feature/checkout-stripe
git push -u origin feature/checkout-stripe
git checkout develop

# Module 6 — Tharushi (Admin — your own branch)
git checkout feature/admin-dashboard
git push -u origin feature/admin-dashboard
git checkout develop
```

---

## ✅ STEP 6: Protect the `main` Branch (IMPORTANT!)

> This prevents other members from pushing to `main` directly.

### Via GitHub Web UI:

1. Go to your repo on GitHub
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **"Add rule"**
4. Fill in:
   - **Branch name pattern**: `main`
   - ✅ Check: **"Require a pull request before merging"**
   - ✅ Check: **"Require approvals"** → set to **1 approval**
   - ✅ Check: **"Restrict who can push to matching branches"**
     - Add **only your GitHub username** (Tharushi)
   - ✅ Check: **"Do not allow bypassing the above settings"**
5. Click **"Create"**

### Also protect `develop` (optional but recommended):
1. Add another rule for `develop`
2. ✅ Require pull requests (1 approval from Tharushi before merging to develop)

---

## ✅ STEP 7: Invite Team Members as Collaborators

1. Go to **Settings** → **Collaborators and teams**
2. Click **"Add people"** and invite each member by their GitHub username:
   - Dinu → role: **Write**
   - Keshara → role: **Write**
   - Achani → role: **Write**
   - Maduni → role: **Write**
   - Kaveesha → role: **Write**
   - Tharushi → role: **Admin** (yourself — already owner)

> **Write** access allows pushing to feature branches but NOT to main (due to protection rules).

---

## ✅ STEP 8: Share Branch Instructions with Team

Send each member this message:

---

> **Hey team! 🌸 AuraGlow repo is set up.**
>
> 1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/auraglow-app.git`
> 2. Switch to your branch:
>    - Dinu: `git checkout feature/auth-profile`
>    - Keshara: `git checkout feature/product-catalog`
>    - Achani: `git checkout feature/cart-wishlist`
>    - Maduni: `git checkout feature/review-recommendation`
>    - Kaveesha: `git checkout feature/checkout-stripe`
>    - Tharushi: `git checkout feature/admin-dashboard`
> 3. **Read the Theme Guide FIRST**: `frontend/src/styles/THEME_GUIDE.md`
> 4. Install dependencies:
>    - `cd frontend && npm install`
>    - `cd ../backend && npm install`
> 5. Copy `.env.example` → `.env` and fill in values I'll share separately
> 6. Run frontend: `npm run dev` (in frontend/)
> 7. Push your work: `git push origin feature/YOUR-BRANCH`
> 8. When done → open a Pull Request to `develop`

---

## 📋 Branch Summary

| Branch | Owner | Purpose |
|--------|-------|---------|
| `main` | Tharushi only | Production-ready, protected |
| `develop` | Tharushi merges PRs | Integration branch |
| `feature/auth-profile` | Dinu | Module 1 development |
| `feature/product-catalog` | Keshara | Module 2 development |
| `feature/cart-wishlist` | Achani | Module 3 development |
| `feature/review-recommendation` | Maduni | Module 4 development |
| `feature/checkout-stripe` | Kaveesha | Module 5 development |
| `feature/admin-dashboard` | Tharushi | Module 6 development |

---

## 🔄 Daily Git Workflow for Members

```bash
# 1. Start your day — pull latest changes from develop
git checkout feature/YOUR-BRANCH
git pull origin develop                # sync with latest integrated code

# 2. Work on your code...

# 3. Stage and commit your changes
git add .
git commit -m "feat(auth): add login form validation"

# 4. Push to your branch
git push origin feature/YOUR-BRANCH

# 5. When feature is complete → open Pull Request on GitHub
#    → base: develop  (NOT main!)
#    → Notify Tharushi to review
```

### Commit Message Format
```
feat(module):     New feature
fix(module):      Bug fix
style(module):    CSS/styling changes
refactor(module): Code restructure
docs(module):     Documentation update
chore(module):    Setup/config changes

Examples:
feat(auth): implement JWT login endpoint
fix(catalog): correct product filter query
style(cart): apply glassmorphism to cart drawer
```

---

*Guide prepared for AuraGlow Team — Tharushi 🌸*
