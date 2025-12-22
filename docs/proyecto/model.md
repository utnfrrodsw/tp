> **[Portal de Documentación](../README.md)** / 🏗️ Modelo de Datos

# 🏗️ Modelo de Datos

El modelo de datos de **UpSkill** es el pilar sobre el que se construye toda la lógica de negocio de la aplicación. Está diseñado para ser relacional, robusto y escalable, garantizando la integridad y consistencia de la información en todo el ecosistema.

Las entidades se organizan en cuatro dominios funcionales clave:

1.  **Usuarios y Perfiles:** Gestiona la identidad, roles (Estudiante, Profesor), autenticación y los perfiles específicos de cada tipo de usuario.
2.  **Contenido Pedagógico:** Define la estructura de los cursos, sus categorías y el banco de preguntas asociado a cada uno.
3.  **Sistema de Evaluaciones:** Modela las actividades, los intentos que realizan los estudiantes y el registro detallado de sus respuestas.
4.  **Flujo Financiero:** Administra todo el ciclo de transacciones, incluyendo pagos, matrículas y ganancias generadas.

---

## 🧬 Modelo de Datos (ERD)

El siguiente diagrama de Entidad-Relación (ERD) muestra el modelo de datos actual del sistema, incluyendo los atributos y las relaciones que existen entre las distintas entidades.


```mermaid
erDiagram

    %% ==================================
    %% --- 1. CORE: USERS & PROFILES ---
    %% ==================================
    User {
        string id PK
        string name
        string surname
        string mail "unique"
        string password "hidden"
        UserRole role "Enum: admin, professor, student"
        string profile_picture "nullable"
        string phone "nullable"
        string location "nullable"
        date birthdate "nullable"
        string resetPasswordToken "nullable, hidden"
        datetime resetPasswordExpires "nullable, hidden"
    }

    Student {
        string id PK
    }

    Professor {
        string id PK
        string state "e.g., pending, active"
    }

    Institution {
        string id PK
        string name
        string description
        string normalizedName "unique"
        string[] aliases "nullable"
    }

    Appeal {
        string id PK
        datetime date
        string state "'pending', 'accepted', 'rejected'"
        string expertise
        string experienceMotivation
        string documentUrl "nullable"
    }

    JoinRequest {
        string id PK
        datetime requestDate
        JoinRequestStatus status "Enum: pending, accepted, rejected"
    }

    %% =====================================
    %% --- 2. COURSES & EDUCATIONAL CONTENT ---
    %% =====================================
    CourseType {
        string id PK
        string name "unique"
        string description
    }

    Course {
        string id PK
        string name
        string description
        boolean isFree
        int priceInCents "nullable, integer to avoid float issues"
        status status "Enum: en-desarrollo, publicado, etc."
        string imageUrl "nullable"
    }

    %% --- Entidad Question ACTUALIZADA ---
    Question {
        string id PK
        string questionText
        QuestionType questionType "Enum: MultipleChoiceOption"
        json payload "Stores options and correctAnswer"
        int unitNumber "nullable"
        int points "default 10"
    }

    %% =====================================
    %% --- 3. ASSESSMENT SYSTEM ---
    %% =====================================
    Assessment {
        string id PK
        string title
        string description "nullable"
        int durationMinutes "nullable"
        int passingScore
        int maxAttempts "nullable"
        boolean isActive
        datetime availableFrom "nullable"
        datetime availableUntil "nullable"
    }

    AssessmentAttempt {
        string id PK
        AttemptStatus status "Enum: in_progress, submitted"
        datetime startedAt
        datetime submittedAt "nullable"
        float score "nullable"
        boolean passed "nullable"
        int attemptNumber
    }

    AttemptAnswer {
        string id PK
        json answer "string | number | string[]"
        boolean isCorrect
        datetime answeredAt
    }

    %% =====================================
    %% --- 4. ENROLLMENT & FINANCIAL FLOW ---
    %% =====================================
    Enrollement {
        string id PK "Unique constraint on (student, course)"
        date createdAt "nullable"
        date enrolledAt
        EnrollmentState state "Enum: enrolled, completed, dropped"
        int grade "nullable"
        int progress "nullable, default 0"
        int[] completedUnits
    }

    Payment {
        string id PK
        string mercadoPagoId
        int amountInCents
        PaymentStatus status "Enum: pending, approved, rejected, etc."
        date createdAt "nullable"
        date paidAt
        json metadata "nullable"
    }

    Earning {
        string id PK
        EarningType type "Enum: professor_share, platform_fee"
        int amountInCents
        EarningStatus status "Enum: pending, processed, paid_out"
        datetime createdAt
        datetime processedAt "nullable"
    }

    %% =====================================
    %% --- 5. EMBEDDABLE & SUPPORTING ENTITIES ---
    %% =====================================
    %% Embeddable entities
    Unit {
        %% (Embeddable)
        int unitNumber
        string name
        string description
        string detail
        ObjectId[] questions "References Question IDs"
    }

    Material {
        %% (Embeddable)
        string title
        string url
    }

    InstitutionCourse {
        %% (Embeddable)
        string name
        string[] aliases "nullable"
    }



    %% =====================================
    %% --- RELATIONSHIP DEFINITIONS ---
    %% =====================================

    
    %% Core Relationships
    User ||--o| Student : "has"
    User ||--o| Professor : "has"
    User ||--o{ Appeal : "submits"
    Professor ||--o{ JoinRequest : "sends"
    Institution ||--o{ JoinRequest : "receives"
    Institution }o--|| Professor : "is member of"
    Professor |o--o| Institution : "manages"

    %% Course Content Relationships
    Professor ||--|{ Course : "creates"
    CourseType ||--|{ Course : "categorizes"
    Course ||--|{ Question : "owns"
    Course ||--o{ Assessment : "has"

    %% Assessment System Relationships
    Assessment }o--o{ Question : "is composed of"
    Student ||--o{ AssessmentAttempt : "takes"
    Assessment ||--o{ AssessmentAttempt : "has"
    AssessmentAttempt ||--|{ AttemptAnswer : "contains"
    Question ||--o{ AttemptAnswer : "is for"

    %% Enrollment & Financial Relationships
    Student ||--o{ Enrollement : "has"
    Course ||--o{ Enrollement : "has"
    Student ||--o{ Payment : "makes"
    Course ||--o{ Payment : "is for"
    Payment |o--|| Enrollement : "results in (optional)"
    Payment ||--o{ Earning : "generates"
    Professor ||--o{ Earning : "receives"

    %% Embeddable Relationships (conceptual only)
    Course ||--o{ Unit : "contains (embedded)"
    Unit ||--o{ Material : "contains (embedded)"
    Unit }o--o{ Question : "references"
    Course ||--o{ InstitutionCourse : "offered by (embedded)"
```