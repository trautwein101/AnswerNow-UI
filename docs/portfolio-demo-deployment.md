# Portfolio demo and deployment

The public portfolio runs in read-only demo mode while the database is offline. Three fictional questions and six answers are bundled in `public/demo-data-v2.json`. No personal resume information is included in the demo fixture.

`demoMode` is enabled in the local/default and PROD environment files; DEV and QA retain live API behavior. Demo mode shows Login, Register and Dashboard Demo navigation. Login and registration forms are read-only with disabled submissions and a demo note. The dashboard uses two sample users (Jason Trautwein and Shannon Collins, with placeholder example.com emails) and sample statistics; role changes and all account management actions are disabled. Visitors see a display-only Demo User identity and signed-in navigation (Admin Panel and Ask a Question). Question and answer forms can be explored and typed into, but submissions/voting are disabled, stored login state is ignored, and a cached static JSON fixture replaces question/answer/admin API reads. The live dashboard still requires admin authorization when demo mode is off. Turning the flag off restores live API behavior; restore and verify the backend first.

## Verify locally

```powershell
npm start
npm test -- --watch=false --filter="Portfolio demo"
npm run build -- --configuration prod
```

Browse `/questions`, open each question, and verify sample answers and disabled voting. Check `/login` and `/register` show preview forms with disabled submission, `/admin` displays sample statistics/users with disabled controls, and `/questions/new` shows an editable preview with disabled submission. The Demo User identity never creates a token or real login. Network requests for demo browsing should load `demo-data-v2.json`, with no API calls.

## Existing AWS hosting (verified October 8, 2026)

- S3 bucket: `answernowplace.com`, Oregon origin; versioning enabled.
- CloudFront: `E34ZG5ZYKBLU90`, alias `answernowplace.com`, default root `index.html`.
- CloudFront 403/404 fallback serves `/index.html` with HTTP 200 for Angular routes.
- Build folder: `dist/answernow-ui/browser`.

Use your configured AWS profile. Never put AWS credentials in source control.

```powershell
aws sts get-caller-identity --region us-west-2
npm run build -- --configuration prod
aws s3 sync dist/answernow-ui/browser s3://answernowplace.com --exclude index.html --cache-control "public,max-age=3600" --region us-west-2
aws s3 cp dist/answernow-ui/browser/demo-data-v2.json s3://answernowplace.com/demo-data-v2.json --cache-control "no-cache" --content-type "application/json" --region us-west-2
aws s3 cp dist/answernow-ui/browser/index.html s3://answernowplace.com/index.html --cache-control "no-cache" --content-type "text/html" --region us-west-2
aws cloudfront create-invalidation --distribution-id E34ZG5ZYKBLU90 --paths "/*"
```

Upload assets first and HTML last. Do not use `--delete`: keep old hashed assets available for existing browser sessions. S3 version history permits restoring the previous index if needed. CloudFront invalidation takes time; verify the homepage, question list and a direct detail URL after it completes.

## GitHub workflow

Work is on `feature/portfolio-demo`. Commit and push that branch, review the diff, and merge via GitHub when ready. GitHub publishing records development activity; S3 uploading updates the actual website. They are separate steps.

This change provisions no database, networking or new AWS services. Existing hosting and traffic charges still apply.

The fixture uses a versioned filename to bypass previously cached JSON. Revalidate it with `no-cache` after asset sync. If its schema changes again, update the filename and service URL together. Verify rendered dashboard cards and rows in a browser, not just HTTP status.
