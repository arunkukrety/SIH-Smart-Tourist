# Issuer Portal MVP - 4 Phase Development Plan

## Overview
**Timeline**: 8 weeks total (2 weeks per phase)  
**Scope**: Basic MVP without authentication system  
**Goal**: Functional document processing and digital ID generation system

---

## Phase 1: Core Document Processing Foundation
**Duration**: Weeks 1-2  
**Goal**: Build the fundamental document upload and OCR processing system

### Week 1: Project Setup & Document Upload
**Day 1-2: Project Foundation**
- Initialize Next.js 14 project with TypeScript
- Setup Supabase database connection
- Configure environment variables and basic project structure
- Install core dependencies (React, Supabase client, UI components)

**Day 3-5: Document Upload System**
- Create `DocumentUpload.tsx` component with drag-drop functionality
- Implement camera capture for mobile/tablet devices
- Setup file validation (size, type, security checks)
- Create basic file preview component
- Setup Supabase storage for document files

**Day 6-7: Database Schema Implementation**
```sql
-- Core tables for Phase 1
CREATE TABLE tourists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_no VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  nationality VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID REFERENCES tourists(id),
  document_type VARCHAR(50) NOT NULL,
  document_number VARCHAR(100),
  file_url TEXT NOT NULL,
  ocr_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Week 2: OCR Integration & Data Processing
**Day 8-10: OCR Service Integration**
- Integrate OCR service (Google Vision API or similar)
- Create `OCRProcessor.tsx` component
- Implement text extraction for passport and ID documents
- Add processing status indicators and loading states
- Handle OCR errors and retry mechanisms

**Day 11-14: Data Extraction & Validation**
- Build `DataExtractor.tsx` for parsing OCR results
- Create validation rules for different document types
- Implement `TouristProfileForm.tsx` for manual data editing
- Add field validation and error handling
- Create basic tourist profile creation workflow

**Phase 1 Deliverables**:
- Working document upload system
- OCR text extraction functionality
- Tourist profile creation form
- Basic database operations (create, read, update)
- File storage and retrieval system

---

## Phase 2: Digital ID Generation System
**Duration**: Weeks 3-4  
**Goal**: Generate QR codes and create digital tourist IDs

### Week 3: QR Code Generation & ID Creation
**Day 15-17: QR Code System**
- Install QR code generation library
- Create `QRCodeGenerator.tsx` component
- Design QR code data structure with tourist information
- Implement QR code customization (size, error correction)
- Add QR code preview and validation

**Day 18-21: Digital ID Structure**
- Design digital ID data model
- Create `DigitalIDCreator.tsx` component
- Implement ID number generation system
- Add validity period management
- Setup ID status tracking (active, expired, revoked)

### Week 4: Blockchain Integration & ID Finalization
**Day 22-24: Basic Blockchain Hash**
- Setup blockchain hash generation (simple SHA-256 initially)
- Create `BlockchainService.ts` for hash operations
- Implement hash storage in database
- Add hash validation and verification
- Create basic blockchain record structure

**Day 25-28: ID Preview & Generation**
- Build `IDPreview.tsx` component
- Create printable ID card layout
- Implement ID generation workflow
- Add ID validation and review system
- Setup ID storage and retrieval

**Database Updates for Phase 2**:
```sql
CREATE TABLE digital_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID REFERENCES tourists(id),
  id_number VARCHAR(100) UNIQUE NOT NULL,
  qr_code TEXT NOT NULL,
  blockchain_hash VARCHAR(255),
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Phase 2 Deliverables**:
- QR code generation system
- Digital ID creation workflow
- Blockchain hash generation
- ID preview and validation
- Printable ID card layout

---

## Phase 3: Trip Management & Emergency Contacts
**Duration**: Weeks 5-6  
**Goal**: Complete trip planning and emergency contact management

### Week 5: Trip Details & Itinerary Management
**Day 29-31: Trip Information System**
- Create `TripDetailsForm.tsx` component
- Implement itinerary input and validation
- Add arrival/departure date management
- Create purpose of visit categorization
- Setup accommodation information capture

**Day 32-35: Advanced Trip Features**
- Build `ItineraryManager.tsx` for detailed planning
- Add multiple destination support
- Implement duration calculation
- Create trip validation rules
- Add trip preview and editing capabilities

### Week 6: Emergency Contacts & Special Needs
**Day 36-38: Emergency Contact Management**
- Create `EmergencyContactForm.tsx` component
- Implement multiple contact support
- Add contact validation and verification
- Create contact priority system (primary/secondary)
- Setup contact information editing

**Day 39-42: Special Requirements**
- Build `SpecialNeedsForm.tsx` component
- Add medical information capture
- Implement accessibility requirement tracking
- Create dietary restriction management
- Add special assistance request system

**Database Updates for Phase 3**:
```sql
CREATE TABLE trip_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID REFERENCES tourists(id),
  purpose VARCHAR(255),
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  accommodation TEXT,
  itinerary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID REFERENCES tourists(id),
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE special_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID REFERENCES tourists(id),
  medical_info TEXT,
  accessibility_needs TEXT,
  dietary_restrictions TEXT,
  assistance_required TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Phase 3 Deliverables**:
- Complete trip management system
- Emergency contact management
- Special needs and requirements tracking
- Trip validation and preview
- Contact verification system

---

## Phase 4: Batch Processing & Reporting
**Duration**: Weeks 7-8  
**Goal**: Handle multiple tourists and generate basic reports

### Week 7: Group & Batch Processing
**Day 43-45: Group Management**
- Create `GroupManager.tsx` component
- Implement tourist grouping functionality
- Add group leader designation
- Create group validation and management
- Setup group-based operations

**Day 46-49: Batch Processing System**
- Build `BatchProcessor.tsx` component
- Implement multiple tourist processing
- Add batch upload for group documents
- Create batch validation and error handling
- Setup batch operation progress tracking

### Week 8: Reporting & Status Management
**Day 50-52: Basic Reporting System**
- Create `ReportsManager.tsx` component
- Implement daily/weekly processing statistics
- Add tourist registration reports
- Create basic analytics dashboard
- Setup report export functionality

**Day 53-56: Status Tracking & Audit Trail**
- Build `StatusTracker.tsx` component
- Implement processing status monitoring
- Create audit trail viewing system
- Add operation history tracking
- Setup basic admin oversight features

**Database Updates for Phase 4**:
```sql
CREATE TABLE tourist_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name VARCHAR(255) NOT NULL,
  group_leader_id UUID REFERENCES tourists(id),
  total_members INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES tourist_groups(id),
  tourist_id UUID REFERENCES tourists(id),
  joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE processing_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name VARCHAR(255),
  total_tourists INTEGER,
  processed_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Phase 4 Deliverables**:
- Group tourist management
- Batch processing capabilities
- Basic reporting dashboard
- Status tracking system
- Audit trail functionality

---

## Technical Implementation Guidelines

### Project Structure
```
issuer-portal/
├── src/
│   ├── components/
│   │   ├── document/
│   │   ├── tourist/
│   │   ├── digital-id/
│   │   ├── trip/
│   │   ├── batch/
│   │   └── shared/
│   ├── pages/
│   │   ├── index.tsx (main dashboard)
│   │   ├── process/
│   │   ├── batch/
│   │   └── reports/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── ocr-service.ts
│   │   ├── qr-generator.ts
│   │   └── validation.ts
│   └── hooks/
│       ├── useTourist.ts
│       ├── useDocument.ts
│       └── useDigitalID.ts
```

### Key Technologies per Phase
- **Phase 1**: Next.js, Supabase, React Hook Form, File upload libraries
- **Phase 2**: QR code libraries, Crypto libraries for hashing
- **Phase 3**: Form validation libraries, Date/time utilities
- **Phase 4**: Chart libraries for reporting, Batch processing utilities

### Testing Strategy
- Unit tests for utility functions
- Component testing for UI components
- Integration testing for database operations
- End-to-end testing for complete workflows

### Performance Considerations
- Image optimization for document uploads
- Lazy loading for large forms
- Database indexing for search operations
- Caching for frequently accessed data

---

## Success Metrics per Phase

### Phase 1 Success Criteria
- Upload documents successfully (100% success rate)
- OCR extracts data with >80% accuracy
- Tourist profiles created correctly
- No data loss during processing

### Phase 2 Success Criteria
- QR codes generated successfully for all tourists
- Digital IDs created with valid blockchain hashes
- ID preview displays correctly
- Validity periods managed properly

### Phase 3 Success Criteria
- Trip details captured completely
- Emergency contacts stored correctly
- Special requirements tracked properly
- Data validation prevents errors

### Phase 4 Success Criteria
- Batch processing handles 10+ tourists simultaneously
- Group management works correctly
- Reports generated accurately
- Audit trail captures all operations

---

## Risk Mitigation

### Technical Risks
- **OCR accuracy issues**: Implement manual review workflow
- **File upload failures**: Add retry mechanisms and error handling
- **Database performance**: Implement proper indexing and query optimization
- **Data validation errors**: Create comprehensive validation rules

### Timeline Risks
- **Scope creep**: Stick to MVP features only
- **Integration delays**: Prepare mock services for external APIs
- **Testing bottlenecks**: Implement testing throughout development
- **Deployment issues**: Setup staging environment early

### Quality Assurance
- Daily code reviews
- Weekly progress assessments  
- End-of-phase demonstrations
- User feedback collection (simulated staff users)

This phased approach ensures steady progress while building a solid foundation for future enhancements.