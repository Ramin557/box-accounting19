// Custom JavaScript for fixing functionality issues

document.addEventListener('DOMContentLoaded', function() {
    // Fix for RTL layout issues
    fixRtlLayout();
    
    // Initialize dropdowns
    initializeDropdowns();
    
    // Fix for chart display
    fixChartDisplay();
    
    // Fix for form submissions
    setupFormValidation();
    
    // Initialize Modern Persian Date Pickers
    initializeModernPersianDatePickers();
    
    // Add current Persian date display
    addCurrentPersianDate();
    
    // Fix dark mode chart colors
    fixDarkModeCharts();
});

/**
 * Fix RTL layout issues
 */
function fixRtlLayout() {
    // Fix sidebar position
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        // Ensure sidebar is on the right in RTL layout
        sidebar.style.float = 'right';
        mainContent.style.float = 'left';
    }
    
    // Fix dropdown menu positioning
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.classList.add('dropdown-menu-end');
    });
}

/**
 * Initialize Bootstrap dropdowns
 */
function initializeDropdowns() {
    // Make sure all dropdowns work properly
    const dropdownToggleElements = document.querySelectorAll('.dropdown-toggle');
    dropdownToggleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                dropdownMenu.classList.toggle('show');
                this.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
                const toggle = dropdown.previousElementSibling;
                if (toggle && toggle.classList.contains('dropdown-toggle')) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

/**
 * Fix chart display issues
 */
function fixChartDisplay() {
    // Fix for performance chart in dashboard
    const performanceChartElement = document.getElementById('performanceChart');
    if (performanceChartElement && typeof Chart !== 'undefined') {
        // Make sure chart is properly sized
        performanceChartElement.style.height = '250px';
        
        // Add RTL support for charts
        Chart.defaults.font.family = "'Vazir', 'IRANSans', sans-serif";
        Chart.defaults.font.size = 12;
    }
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Highlight invalid fields
                const invalidFields = form.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    field.classList.add('is-invalid');
                    
                    // Add event listener to remove invalid class when field is changed
                    field.addEventListener('input', function() {
                        if (this.checkValidity()) {
                            this.classList.remove('is-invalid');
                        }
                    });
                });
            }
            
            form.classList.add('was-validated');
        });
    });
}

/**
 * Initialize Modern Persian Date Pickers with Holiday Support
 */
function initializePersianDatePickers() {
    // Find all date input fields with data-persian-datepicker attribute or type="date"
    const dateInputs = document.querySelectorAll('input[data-persian-datepicker="true"], input[type="date"]');
    
    dateInputs.forEach(input => {
        initializeMdPersianDateTimePicker(input);
    });
    
    // This section handles date range inputs that don't have data-persian-datepicker="true" attribute
    // but have specific name patterns for date ranges
    const dateRangeInputs = document.querySelectorAll('input[name*="from_date"], input[name*="to_date"], input[name*="start_date"], input[name*="end_date"]');
    
    dateRangeInputs.forEach(input => {
        // Skip if already processed by the first part (has data-persian-datepicker="true" attribute)
        if (input.getAttribute('data-persian-datepicker') === 'true') {
            return;
        }
        
        if (input.type === 'date') {
            initializeMdPersianDateTimePicker(input);
        }
    });
}

/**
 * Initialize MD Bootstrap Persian DateTime Picker for a specific input
 */
function initializeMdPersianDateTimePicker(input) {
    // Mark as initialized to prevent double initialization
    if (input.hasAttribute('data-md-picker-initialized')) {
        return;
    }
    input.setAttribute('data-md-picker-initialized', 'true');
    
    // Convert the input to text type for better control
    input.type = 'text';
    input.placeholder = 'انتخاب تاریخ شمسی';
    input.dir = 'rtl';
    input.readOnly = true;
    input.style.cursor = 'pointer';
    
    // Add calendar icon
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    input.parentNode.insertBefore(inputGroup, input);
    inputGroup.appendChild(input);
    
    const inputGroupText = document.createElement('span');
    inputGroupText.className = 'input-group-text';
    inputGroupText.innerHTML = '<i class="fas fa-calendar-alt"></i>';
    inputGroup.appendChild(inputGroupText);
    
    // Initialize MD Persian DateTime Picker with full holiday support
    if (typeof $ !== 'undefined' && $.fn.MdPersianDateTimePicker) {
        $(input).MdPersianDateTimePicker({
            targetTextSelector: input,
            englishNumber: true,
            textFormat: 'yyyy-MM-dd',
            isGregorian: false,
            selectedDateToShow: new Date(),
            holidayList: [
                // نوروز
                { month: 1, day: 1, title: "نوروز" },
                { month: 1, day: 2, title: "نوروز" },
                { month: 1, day: 3, title: "نوروز" },
                { month: 1, day: 4, title: "نوروز" },
                
                // روزهای ملی و مذهبی
                { month: 1, day: 12, title: "روز جمهوری اسلامی" },
                { month: 1, day: 13, title: "روز طبیعت (سیزده بدر)" },
                { month: 2, day: 11, title: "پیروزی انقلاب اسلامی" },
                { month: 3, day: 14, title: "رحلت امام خمینی" },
                { month: 3, day: 15, title: "قیام ۱۵ خرداد" },
                { month: 6, day: 28, title: "شهادت امام علی" },
                { month: 8, day: 27, title: "شب قدر" },
                { month: 9, day: 1, title: "عید فطر" },
                { month: 9, day: 2, title: "تعطیل عید فطر" },
                { month: 10, day: 20, title: "شهادت امام صادق" },
                { month: 11, day: 10, title: "عید قربان" },
                { month: 11, day: 18, title: "عید غدیر خم" },
                { month: 12, day: 9, title: "تاسوعا" },
                { month: 12, day: 10, title: "عاشورا" },
                { month: 12, day: 20, title: "اربعین" },
                { month: 12, day: 28, title: "رحلت پیامبر و شهادت امام حسن" },
                { month: 12, day: 29, title: "شهادت امام رضا" }
            ],
            modalMode: true,
            placement: 'bottom',
            rangeSelector: false,
            fromDate: null,
            toDate: null,
            disableBeforeToday: false,
            disableAfterToday: false,
            enableTimePicker: false,
            groupId: '',
            toSelectorText: 'تا تاریخ',
            fromSelectorText: 'از تاریخ'
        });
    }
}

/**
 * Initialize Modern Persian Date Pickers with Holiday Support
 * This is the main function that replaces the old date picker
 */
function initializeModernPersianDatePickers() {
    // Call the main initialization function for all inputs
    initializePersianDatePickers();
    
    // Also initialize any new date inputs that might be added dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const dateInputs = node.querySelectorAll 
                        ? node.querySelectorAll('input[type="date"], input[data-persian-datepicker="true"]')
                        : [];
                    
                    dateInputs.forEach(input => {
                        if (!input.hasAttribute('data-md-picker-initialized')) {
                            initializeMdPersianDateTimePicker(input);
                        }
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Add current Persian date to the page header
 */
function addCurrentPersianDate() {
    // Try to add current Persian date to header if possible
    const header = document.querySelector('.d-flex.justify-content-between.align-items-center');
    if (header && !document.querySelector('.current-persian-date')) {
        const dateElement = document.createElement('div');
        dateElement.className = 'current-persian-date text-muted small';
        dateElement.style.direction = 'rtl';
        
        // Get current Persian date
        const today = new Date();
        const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }).format(today);
        
        dateElement.innerHTML = `<i class="fas fa-calendar-alt me-1"></i> امروز: ${persianDate}`;
        
        // Find a good place to insert it
        const breadcrumbDiv = header.querySelector('div:first-child');
        if (breadcrumbDiv) {
            breadcrumbDiv.appendChild(dateElement);
        }
    }
}

window.selectDate = function(year, month, day) {
    if (window.currentDateInput) {
        const date = new Date(year, month, day);
        const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' });
        window.currentDateInput.value = formatter.format(date);
        closeDatePicker();
    }
};

window.selectToday = function() {
    if (window.currentDateInput) {
        const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' });
        window.currentDateInput.value = formatter.format(new Date());
        closeDatePicker();
    }
};

window.closeDatePicker = function() {
    if (window.currentDatePopup) {
        window.currentDatePopup.remove();
        window.currentDatePopup = null;
        window.currentDateInput = null;
    }
};

/**
 * Fix dark mode chart colors
 */
function fixDarkModeCharts() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode && typeof Chart !== 'undefined') {
        Chart.defaults.color = '#ffffff';
        Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.plugins.legend.labels.color = '#ffffff';
    }
}