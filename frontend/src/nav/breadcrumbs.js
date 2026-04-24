/**
 * Route → breadcrumb trail for the app shell top bar.
 * Each crumb: { label: string, to?: string } — omit `to` on the current page.
 */

/** @param {string} label @param {string} [to] */
const D = (label, to) => (to ? { label, to } : { label });

const ROUTES = {
    "/dashboard": [D("Dashboard", "/dashboard")],
    "/account_page": [D("Dashboard", "/dashboard"), D("Account")],
    "/account_reset_pass": [D("Dashboard", "/dashboard"), D("Account", "/account_page"), D("Change password")],
    "/locker_management": [D("Dashboard", "/dashboard"), D("Locker management")],
    "/editLockerDetails": [D("Dashboard", "/dashboard"), D("Locker management", "/locker_management"), D("Edit locker")],
    "/issue_reporting": [D("Dashboard", "/dashboard"), D("Issue reporting")],
    "/locker_issue": [D("Dashboard", "/dashboard"), D("Locker issue")],
    "/technical_issue": [D("Dashboard", "/dashboard"), D("Technical issue")],
    "/add_single_locker": [D("Dashboard", "/dashboard"), D("Add locker")],
    "/add_multiple_locker": [D("Dashboard", "/dashboard"), D("Add multiple lockers")],
    "/delete_locker": [D("Dashboard", "/dashboard"), D("Delete locker")],
    "/update_locker_price": [D("Dashboard", "/dashboard"), D("Update locker price")],
    "/locker_analysis": [D("Dashboard", "/dashboard"), D("Locker analysis")],
    "/locker_history": [D("Dashboard", "/dashboard"), D("Locker history")],
    "/issue_management": [D("Dashboard", "/dashboard"), D("Issue management")],
    "/staff_management": [D("Dashboard", "/dashboard"), D("Staff management")],
    "/add_single_staff": [D("Dashboard", "/dashboard"), D("Add staff")],
    "/view_staff_details": [D("Dashboard", "/dashboard"), D("Staff", "/staff_management"), D("Staff details")],
    "/edit_staff_details": [D("Dashboard", "/dashboard"), D("Staff", "/staff_management"), D("Edit staff")],
    "/testing": [D("Dashboard", "/dashboard"), D("Testing")],
    "/available_lockers": [D("Dashboard", "/dashboard"), D("Available lockers")],
    "/assign_locker": [D("Dashboard", "/dashboard"), D("Assign locker")],
    "/renew_locker": [D("Dashboard", "/dashboard"), D("Renew locker")],
    "/cancel_locker": [D("Dashboard", "/dashboard"), D("Cancel locker")],
    "/update_locker": [D("Dashboard", "/dashboard"), D("Update expired lockers")],
    "/update_locker_feature": [D("Dashboard", "/dashboard"), D("Reset combination")],
    "/view_report_status": [D("Dashboard", "/dashboard"), D("Report status")],
};

/**
 * @param {string} pathname
 * @returns {{ label: string, to?: string }[]}
 */
export function getBreadcrumbs(pathname) {
    const path = (pathname || "/").split("?")[0] || "/";
    if (ROUTES[path]) {
        const raw = ROUTES[path];
        return raw.map((c, i) => {
            if (i === raw.length - 1) return { label: c.label };
            return { label: c.label, to: c.to };
        });
    }
    return [D("Dashboard", "/dashboard"), { label: "Page" }];
}
