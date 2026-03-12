# Fix Plan: SES Warning and 404 Error in SvelteKit Project

## Problem Summary

1. **SES Removing unpermitted intrinsics warning**: Originates from SES (Secure EcmaScript) sandboxing library, likely via `svelte-pdf` dependency
2. **404 error loading \_\_data.json**: Configuration issue with SvelteKit's trailing slash handling and static adapter

## Root Causes Identified

### 1. SES Warning

- **Source**: `svelte-pdf` dependency (custom GitHub version)
- **Issue**: The library uses PDF.js which might include SES sandboxing
- **Impact**: Warning message in console, but functionality remains intact

### 2. 404 Error for \_\_data.json

- **Source**: SvelteKit's page data loading mechanism
- **Root Cause**: When accessing `/glean/` with trailing slash, the browser requests `/glean/__data.json`, but when accessing `/glean` without trailing slash, it might request `__data.json` without base path
- **Verification**: The file exists at `/glean/__data.json` (tested with curl)

## Fix Strategy

### Phase 1: Fix the 404 Error (High Priority)

1. **Configure Trailing Slash Behavior**:
   - Add explicit trailing slash configuration to svelte.config.js
   - Ensure consistency between page URLs and data file paths

2. **Check Base Path Configuration**:
   - Verify that paths.base is correctly configured for static adapter
   - Ensure all links and resources use resolve() helper

3. **Test Different Scenarios**:
   - Test both trailing slash and non-trailing slash versions
   - Verify data file loading in different environments

### Phase 2: Resolve SES Warning (Medium Priority)

1. **Investigate svelte-pdf Dependency**:
   - Check if PDF.js version can be updated or configured
   - Look for alternatives if the warning persists
   - Consider if we need to replace the custom svelte-pdf version

2. **Configure Build Warnings**:
   - Explore if SES warnings can be suppressed
   - Check if PDF.js has configuration options for sandboxing

### Phase 3: Test and Verify Fixes

1. **Build and Test Locally**:
   - Run `npm run build` to generate production build
   - Serve build locally and test all routes
   - Verify \_\_data.json loads correctly

2. **Deploy and Monitor**:
   - Deploy fixed version
   - Monitor for any remaining issues

## Implementation Steps

1. First, fix the trailing slash configuration
2. Test data loading
3. Then address the SES warning
4. Verify all fixes thoroughly

## Risk Assessment

- **Low Risk**: Configuring trailing slash behavior
- **Medium Risk**: Updating or replacing svelte-pdf
- **High Risk**: Breaking existing functionality like PDF rendering

I recommend proceeding with the trailing slash configuration fix first, as it's the more critical issue affecting user experience.
