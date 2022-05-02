<template>
  <modal>
    <div class="overlay" @click="$emit('windChart-close')"></div>
    <div id="windCountGraph">
      <table>
        <thead>
        <tr class="head_title">
          <th>m/s</th>
          <th>~5</th>
          <th>~8</th>
          <th>~11</th>
          <th>11~</th>
          <th>합계</th>
        </tr>
        <tr class="head_subTitle">
          <th></th>
          <th class="legend_1"></th>
          <th class="legend_2"></th>
          <th class="legend_3"></th>
          <th class="legend_4"></th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <!--        <tr class="odd_row">
                  <td class="windDirect_1">N</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_2">NNE</td>
                  <td></td>
                  <td></td>
                  <td>3</td>
                  <td></td>
                  <td>2</td>
                  <td></td>
                  <td>1</td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_3">NE</td>
                  <td>5</td>
                  <td></td>
                  <td></td>
                  <td>3</td>
                  <td></td>
                  <td></td>
                  <td>2</td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_4">ENE</td>
                  <td></td>
                  <td>1</td>
                  <td></td>
                  <td>2</td>
                  <td></td>
                  <td>3</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_5">E</td>
                  <td>4</td>
                  <td></td>
                  <td></td>
                  <td>5</td>
                  <td></td>
                  <td>15</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_6">ESE</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>4</td>
                  <td>32</td>
                  <td>2</td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_7">SE</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>3</td>
                  <td>5</td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_8">SSE</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_9">S</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_10">SSW</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_11">SW</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_12">WSW</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_13">W</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_14">WNW</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="odd_row">
                  <td class="windDirect_15">NW</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="even_row">
                  <td class="windDirect_16">NNW</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>-->
        </tbody>
      </table>
    </div>
  </modal>
</template>

<script>
import windrose from '../statistics/chart_attribute/windrose.js';
import $ from 'jquery';

export default {
  data: function () {
    return {
      getWindData: windrose,
      windData: [],
    };
  },
  mounted() {
    this.getWindTableData();
  },
  methods: {
    getWindTableData() {
      this.windData = this.getWindData.getWindTableCallFunction();
      let color = this.windData['color'];
      let direction = this.windData['direction'];
      let spdSize = this.windData['spdSize'];
      let dirSize = this.windData['dirSize'];
      let percentData = this.windData['percentData'];

      $('#windCountGraph table > tbody > tr > td').empty();
      $('.head_subTitle th').each(function (index) {
        const t = $(this);
        if (index > 0) {
          t.css('background-color', color[index]);
        }
      });
      for (let dirIndex = 0; dirIndex < dirSize; dirIndex++) {
        let sum = 0;
        const tr = $('<tr class="windRoseTableBody ' + (dirIndex % 2 == 0 ? "even":"odd") + '">');
        tr.append("<td class='windRoseDirection'>" + direction[dirIndex] + "</td>");
        for (let spdIndex = 1; spdIndex < spdSize; spdIndex++) {
          const value = percentData[spdIndex][dirIndex];
          if (value > 0) {
            tr.append("<td>" + value.toFixed(2) + "</td>");
            sum += value;
          } else {
            tr.append("<td></td>");
          }
        }

        if (sum > 0) {
          tr.append("<td>" + sum.toFixed(2) + "</td>");
        } else {
          tr.append("<td></td>");
        }

        $('#windCountGraph table > tbody:last-child').append(tr);
      }

      $('#windCountGraph table').css('display', 'table');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/popup/windChartPopup";
</style>
