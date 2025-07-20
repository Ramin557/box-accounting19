"""
RBAC Routes - Role-Based Access Control Management
"""

from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from app import app, db
from models import User, Role, Permission
from functools import wraps
from datetime import datetime

# Permission decorator
def permission_required(permission_name):
    """Decorator to check if current user has a specific permission"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                flash('لطفاً وارد سیستم شوید.', 'warning')
                return redirect(url_for('login'))
            
            if not current_user.has_permission(permission_name):
                flash('شما دسترسی لازم برای انجام این عمل را ندارید.', 'error')
                return redirect(url_for('dashboard'))
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# RBAC Management Routes

@app.route('/rbac/roles')
@login_required
@permission_required('manage_roles')
def rbac_roles():
    """List all roles"""
    roles = Role.query.order_by(Role.name).all()
    return render_template('rbac/roles.html', roles=roles)

@app.route('/rbac/roles/create', methods=['GET', 'POST'])
@login_required
@permission_required('manage_roles')
def rbac_create_role():
    """Create a new role"""
    if request.method == 'POST':
        role = Role(
            name=request.form.get('name'),
            display_name=request.form.get('display_name'),
            description=request.form.get('description'),
            is_system_role=False
        )
        
        try:
            db.session.add(role)
            db.session.commit()
            flash(f'نقش "{role.display_name}" با موفقیت ایجاد شد.', 'success')
            return redirect(url_for('rbac_edit_role', role_id=role.id))
        except Exception as e:
            db.session.rollback()
            flash('خطا در ایجاد نقش جدید.', 'error')
    
    return render_template('rbac/create_role.html')

@app.route('/rbac/roles/<int:role_id>')
@login_required
@permission_required('manage_roles')
def rbac_edit_role(role_id):
    """Edit role and manage permissions"""
    role = Role.query.get_or_404(role_id)
    all_permissions = Permission.query.order_by(Permission.category, Permission.name).all()
    
    # Group permissions by category
    permissions_by_category = {}
    for permission in all_permissions:
        category = permission.category or 'other'
        if category not in permissions_by_category:
            permissions_by_category[category] = []
        permissions_by_category[category].append(permission)
    
    return render_template('rbac/edit_role.html', 
                         role=role, 
                         permissions_by_category=permissions_by_category)

@app.route('/rbac/roles/<int:role_id>/update', methods=['POST'])
@login_required
@permission_required('manage_roles')
def rbac_update_role(role_id):
    """Update role information and permissions"""
    role = Role.query.get_or_404(role_id)
    
    # Update basic information
    role.display_name = request.form.get('display_name')
    role.description = request.form.get('description')
    
    # Update permissions
    selected_permissions = request.form.getlist('permissions')
    role.permissions.clear()
    
    for perm_id in selected_permissions:
        permission = Permission.query.get(int(perm_id))
        if permission:
            role.permissions.append(permission)
    
    try:
        db.session.commit()
        flash(f'نقش "{role.display_name}" با موفقیت به‌روزرسانی شد.', 'success')
    except Exception as e:
        db.session.rollback()
        flash('خطا در به‌روزرسانی نقش.', 'error')
    
    return redirect(url_for('rbac_edit_role', role_id=role_id))

@app.route('/rbac/roles/<int:role_id>/delete', methods=['POST'])
@login_required
@permission_required('manage_roles')
def rbac_delete_role(role_id):
    """Delete a role"""
    role = Role.query.get_or_404(role_id)
    
    if role.is_system_role:
        flash('نقش‌های سیستمی قابل حذف نیستند.', 'error')
        return redirect(url_for('rbac_roles'))
    
    if role.users:
        flash('نمی‌توان نقشی را حذف کرد که کاربران فعال دارد.', 'error')
        return redirect(url_for('rbac_roles'))
    
    try:
        role.permissions.clear()
        db.session.delete(role)
        db.session.commit()
        flash(f'نقش "{role.display_name}" با موفقیت حذف شد.', 'success')
    except Exception as e:
        db.session.rollback()
        flash('خطا در حذف نقش.', 'error')
    
    return redirect(url_for('rbac_roles'))

@app.route('/rbac/permissions')
@login_required
@permission_required('manage_roles')
def rbac_permissions():
    """List all permissions"""
    permissions = Permission.query.order_by(Permission.category, Permission.name).all()
    
    # Group by category
    permissions_by_category = {}
    for permission in permissions:
        category = permission.category or 'other'
        if category not in permissions_by_category:
            permissions_by_category[category] = []
        permissions_by_category[category].append(permission)
    
    return render_template('rbac/permissions.html', 
                         permissions_by_category=permissions_by_category)

@app.route('/rbac/users')
@login_required
@permission_required('manage_users')
def rbac_users():
    """Enhanced user management with RBAC"""
    users = User.query.order_by(User.username).all()
    roles = Role.query.order_by(Role.display_name).all()
    return render_template('rbac/users.html', users=users, roles=roles)

@app.route('/rbac/users/<int:user_id>/update-role', methods=['POST'])
@login_required
@permission_required('manage_users')
def rbac_update_user_role(user_id):
    """Update user's role"""
    user = User.query.get_or_404(user_id)
    new_role_id = request.form.get('role_id')
    
    if new_role_id:
        role = Role.query.get(int(new_role_id))
        if role:
            user.role_id = role.id
            user.role = role.name  # Keep legacy field in sync
            
            try:
                db.session.commit()
                flash(f'نقش کاربر "{user.full_name}" به "{role.display_name}" تغییر یافت.', 'success')
            except Exception as e:
                db.session.rollback()
                flash('خطا در تغییر نقش کاربر.', 'error')
    
    return redirect(url_for('rbac_users'))

@app.route('/rbac/users/create', methods=['GET', 'POST'])
@login_required
@permission_required('manage_users')
def rbac_create_user():
    """Create new user with role assignment"""
    if request.method == 'POST':
        user = User(
            username=request.form.get('username'),
            email=request.form.get('email'),
            full_name=request.form.get('full_name'),
            is_active=request.form.get('is_active') == 'on'
        )
        user.set_password(request.form.get('password'))
        
        # Assign role
        role_id = request.form.get('role_id')
        if role_id:
            role = Role.query.get(int(role_id))
            if role:
                user.role_id = role.id
                user.role = role.name  # Keep legacy field in sync
        
        try:
            db.session.add(user)
            db.session.commit()
            flash(f'کاربر "{user.full_name}" با موفقیت ایجاد شد.', 'success')
            return redirect(url_for('rbac_users'))
        except Exception as e:
            db.session.rollback()
            flash('خطا در ایجاد کاربر جدید.', 'error')
    
    roles = Role.query.order_by(Role.display_name).all()
    return render_template('rbac/create_user.html', roles=roles)

# API Routes for AJAX requests

@app.route('/api/user/<int:user_id>/permissions')
@login_required
def api_user_permissions(user_id):
    """Get user's permissions via API"""
    if not current_user.has_permission('manage_users'):
        return jsonify({'error': 'دسترسی مجاز نیست'}), 403
    
    user = User.query.get_or_404(user_id)
    permissions = user.get_permissions()
    
    return jsonify({
        'user_id': user_id,
        'username': user.username,
        'role': user.get_role_display_name(),
        'permissions': permissions
    })

@app.route('/api/role/<int:role_id>/permissions')
@login_required
def api_role_permissions(role_id):
    """Get role's permissions via API"""
    if not current_user.has_permission('manage_roles'):
        return jsonify({'error': 'دسترسی مجاز نیست'}), 403
    
    role = Role.query.get_or_404(role_id)
    permissions = [{'id': p.id, 'name': p.name, 'description': p.description} 
                  for p in role.permissions]
    
    return jsonify({
        'role_id': role_id,
        'role_name': role.display_name,
        'permissions': permissions
    })

# Template context processors for RBAC

@app.context_processor
def rbac_context():
    """Add RBAC functions to template context"""
    def has_permission(permission_name):
        if current_user.is_authenticated:
            return current_user.has_permission(permission_name)
        return False
    
    def has_any_permission(permission_names):
        if current_user.is_authenticated:
            return current_user.has_any_permission(permission_names)
        return False
    
    return {
        'has_permission': has_permission,
        'has_any_permission': has_any_permission
    }