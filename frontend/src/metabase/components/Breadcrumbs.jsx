import React, { Component, PropTypes } from "react";

import S from "./Breadcrumbs.css";

import Icon from "metabase/components/Icon.jsx";
import Ellipsified from "metabase/components/Ellipsified.jsx";

import cx from 'classnames';

export default class Breadcrumbs extends Component {
    static propTypes = {
        crumbs: PropTypes.array,
        inSidebar: PropTypes.bool,
        placeholder: PropTypes.string
    };
    static defaultProps = {
        crumbs: [],
        inSidebar: false,
        placeholder: null
    };

    render() {
        const {
            crumbs,
            inSidebar,
            placeholder
        } = this.props;

        const breadcrumbClass = inSidebar ? S.sidebarBreadcrumb : S.breadcrumb;
        const breadcrumbsClass = inSidebar ? S.sidebarBreadcrumbs : S.breadcrumbs;

        return (
            <section className={breadcrumbsClass}>
                { crumbs.length <= 1 && placeholder ?
                    <span className={cx(breadcrumbClass, S.breadcrumbPage)}>
                        {placeholder}
                    </span> :
                    crumbs
                        .map(breadcrumb => Array.isArray(breadcrumb) ?
                            breadcrumb : [breadcrumb]
                        )
                        .map((breadcrumb, index) =>
                            <Ellipsified
                                key={index}
                                tooltip={breadcrumb[0]}
                                tooltipMaxWidth="100%"
                                className={cx(
                                    breadcrumbClass,
                                    breadcrumb.length > 1 ?
                                        S.breadcrumbPath : S.breadcrumbPage
                                )}
                            >
                                { breadcrumb.length > 1 ?
                                    <a href={breadcrumb[1]}>{breadcrumb[0]}</a> :
                                    <span>{breadcrumb[0]}</span>
                                }
                            </Ellipsified>
                        )
                        .map((breadcrumb, index, breadcrumbs) =>
                            index < breadcrumbs.length - 1 ?
                                [
                                    breadcrumb,
                                    <Icon
                                        key={`${index}-separator`}
                                        name="chevronright"
                                        className={S.breadcrumbDivider}
                                        width={12}
                                        height={12}
                                    />
                                ] :
                                breadcrumb
                        )
                }
            </section>
        );
    }
}
