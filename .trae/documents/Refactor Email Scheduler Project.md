This plan outlines the refactoring of the Email Scheduler system into a structured Frontend (React) and Backend (NestJS) architecture, strictly following your requirements.

## 1. Project Structure
We will adopt a monorepo-like structure:
- **Root**: Backend (NestJS) - leveraging the existing setup.
- **`frontend/`**: New React + Vite application.

## 2. Backend Refactoring (NestJS)
We will refactor the existing code to match the new database schema and functional requirements.

### Database & Entities (TypeORM)
- **`User`**: `id`, `email`, `password`, `created_at`, `updated_at`.
- **`EmailTemplate`**: `id`, `subject`, `body`, `created_at`, `updated_at`.
- **`ScheduledTask`**: `id`, `user_id`, `email_template_id`, `schedule` (cron string), `status` (pending/running/paused/etc), `timestamps`.
- **`EmailLog`**: `id`, `task_id`, `status` (success/failure), `sent_at`, `error_msg`.

### Modules & API
- **`AuthModule`**:
  - `POST /auth/register`: User registration.
  - `POST /auth/login`: JWT login.
- **`EmailTemplatesModule`**:
  - `GET/POST/PUT/DELETE /templates`: CRUD operations.
- **`TasksModule`**:
  - `GET/POST/PUT/DELETE /tasks`: CRUD operations.
  - `POST /tasks/:id/start`: Start a task (register cron job).
  - `POST /tasks/:id/pause`: Pause a task (remove cron job).
  - **Scheduler Logic**: Use `@nestjs/schedule` to dynamically manage Cron jobs based on active tasks.
- **`EmailLogsModule`**:
  - `GET /logs`: View execution history.
- **`MailModule`**:
  - Shared service to handle email sending via Nodemailer/SendGrid.

### Cleanup
- Remove unused modules (`weather`).
- Update `app.module.ts` to reflect the new structure.

## 3. Frontend Implementation (React + Vite)
We will create a modern React application from scratch in the `frontend/` directory.

### Tech Stack
- **Framework**: React + Vite + TypeScript
- **UI Library**: Ant Design (for tables, forms, layout)
- **State/Network**: Axios, React Router

### Pages & Features
- **Auth**: Login and Register pages.
- **Layout**: Sidebar navigation (Templates, Tasks, History).
- **Templates**: List view, Create/Edit modal/page.
- **Tasks**:
  - List view showing status.
  - Controls to Start/Pause/Delete tasks.
  - Create/Edit wizard to select Template and set Schedule (Cron).
- **History**: Page to view logs, filterable by task or status.

## 4. Execution Steps
1.  **Backend**: Install dependencies, create new entities/modules, migrate logic, and verify API with Swagger/Postman.
2.  **Frontend**: Initialize Vite project, install AntD/Axios, build pages, and connect to Backend API.
3.  **Integration**: Verify end-to-end flow (User -> Template -> Task -> Email Sent -> Log Recorded).
